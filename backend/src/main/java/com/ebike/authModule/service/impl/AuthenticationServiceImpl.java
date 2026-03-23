package com.ebike.authModule.service.impl;

import com.ebike.authModule.dto.AuthResponse;
import com.ebike.authModule.dto.LoginRequest;
import com.ebike.authModule.dto.RegisterRequest;
import com.ebike.authModule.dto.UserProfileResponse;
import com.ebike.authModule.entity.AuthenticationLog;
import com.ebike.authModule.entity.Role;
import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.AuthenticationLogRepository;
import com.ebike.authModule.repository.RoleRepository;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.authModule.service.AuthenticationService;
import com.ebike.authModule.service.PermissionService;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String DEFAULT_CUSTOMER_ROLE = "CUSTOMER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationLogRepository authenticationLogRepository;
    private final PermissionService permissionService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(
        UserRepository userRepository,
        RoleRepository roleRepository,
        AuthenticationLogRepository authenticationLogRepository,
        PermissionService permissionService,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authenticationLogRepository = authenticationLogRepository;
        this.permissionService = permissionService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        if (userRepository.existsByUsername(request.username().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        User user = new User();
        user.setUsername(request.username().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password().trim()));
        user.setFirstName(trimToNull(request.firstName()));
        user.setLastName(trimToNull(request.lastName()));
        user.setActive(true);
        user.setVerified(false);

        roleRepository.findByName(DEFAULT_CUSTOMER_ROLE)
            .ifPresent(role -> user.getRoles().add(role));

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        if (request == null || isBlank(request.usernameOrEmail()) || isBlank(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "usernameOrEmail and password are required");
        }

        User user = findUser(request.usernameOrEmail());
        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is inactive");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        AuthenticationLog log = new AuthenticationLog();
        log.setUser(user);
        log.setLoginTime(LocalDateTime.now());
        log.setIpAddress(trimToNull(ipAddress));
        log.setUserAgent(trimToNull(userAgent));
        authenticationLogRepository.save(log);

        return toAuthResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String usernameOrEmail) {
        if (isBlank(usernameOrEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "usernameOrEmail is required");
        }

        User user = findUser(usernameOrEmail);
        return new UserProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getActive(),
            user.getVerified(),
            extractRoleNames(user),
            permissionService.resolvePermissionCodes(user)
        );
    }

    private User findUser(String usernameOrEmail) {
        String trimmed = usernameOrEmail.trim();
        return userRepository.findByEmail(trimmed.toLowerCase(Locale.ROOT))
            .or(() -> userRepository.findByUsername(trimmed))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        if (isBlank(request.username()) || isBlank(request.email()) || isBlank(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username, email, and password are required");
        }
        if (request.password().trim().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            buildFullName(user),
            "demo-token-" + UUID.randomUUID(),
            extractRoleNames(user)
        );
    }

    private Set<String> extractRoleNames(User user) {
        return user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String buildFullName(User user) {
        String firstName = user.getFirstName() == null ? "" : user.getFirstName();
        String lastName = user.getLastName() == null ? "" : user.getLastName();
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isBlank() ? user.getUsername() : fullName;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

package com.ebike.authModule.service.impl;

import com.ebike.authModule.dto.AuthResponse;
import com.ebike.authModule.dto.EnhancedAuthResponse;
import com.ebike.authModule.dto.LoginRequest;
import com.ebike.authModule.dto.RegisterRequest;
import com.ebike.authModule.dto.RoleSpecificLoginResponse;
import com.ebike.authModule.dto.UserProfileResponse;
import com.ebike.authModule.entity.AuthenticationLog;
import com.ebike.authModule.entity.Role;
import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.AuthenticationLogRepository;
import com.ebike.authModule.repository.RoleRepository;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.authModule.service.AuthenticationService;
import com.ebike.authModule.service.JwtTokenProvider;
import com.ebike.authModule.service.PermissionService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final String DEFAULT_CUSTOMER_ROLE = "CUSTOMER";

    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationLogRepository authenticationLogRepository;
    private final PermissionService permissionService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthenticationServiceImpl(
        UserRepository userRepository,
        RoleRepository roleRepository,
        AuthenticationLogRepository authenticationLogRepository,
        PermissionService permissionService,
        PasswordEncoder passwordEncoder,
        JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authenticationLogRepository = authenticationLogRepository;
        this.permissionService = permissionService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
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

        Role defaultRole = roleRepository.findByName(DEFAULT_CUSTOMER_ROLE)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Default role is missing"));
        user.getRoles().add(defaultRole);

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
    public EnhancedAuthResponse enhancedLogin(LoginRequest request, String ipAddress, String userAgent) {
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

        return toEnhancedAuthResponse(user);
    }

    @Override
    public RoleSpecificLoginResponse roleSpecificLogin(
        LoginRequest request,
        String requiredRole,
        String ipAddress,
        String userAgent
    ) {
        EnhancedAuthResponse authResponse = enhancedLogin(request, ipAddress, userAgent);

        User user = findUser(request.usernameOrEmail());
        Set<String> roles = extractRoleNames(user);
        String normalizedRequiredRole = requiredRole.toUpperCase(Locale.ROOT);
        if (!roles.contains(normalizedRequiredRole)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "User does not have required role: " + normalizedRequiredRole
            );
        }

        Object roleData = buildRoleSpecificData(user, normalizedRequiredRole);

        return new RoleSpecificLoginResponse(normalizedRequiredRole, roleData, authResponse);
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

    @Override
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    @Override
    public String extractUsernameFromToken(String token) {
        return jwtTokenProvider.extractUsername(token);
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
        Set<String> roles = extractRoleNames(user);
        return new AuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            buildFullName(user),
            "demo-token-" + UUID.randomUUID(),
            roles
        );
    }

    private EnhancedAuthResponse toEnhancedAuthResponse(User user) {
        Set<String> roles = extractRoleNames(user);
        if (roles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User does not have any assigned roles");
        }

        String jwtToken = jwtTokenProvider.generateToken(user);
        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = issuedAt.plusNanos(jwtExpirationMs * 1_000_000L);

        return new EnhancedAuthResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            buildFullName(user),
            jwtToken,
            roles,
            user.getActive(),
            user.getVerified(),
            issuedAt,
            expiresAt
        );
    }

    private Object buildRoleSpecificData(User user, String role) {
        Map<String, Object> roleData = new HashMap<>();
        roleData.put("role", role);
        roleData.put("userId", user.getId());
        roleData.put("permissions", permissionService.resolvePermissionCodes(user));

        switch (role.toUpperCase()) {
            case "CUSTOMER":
                roleData.put("type", "Individual Customer");
                roleData.put("memberSince", user.getCreatedAt());
                break;
            case "STAFF":
                roleData.put("type", "Store Staff");
                roleData.put("department", "Sales/Support");
                break;
            case "MANAGER":
                roleData.put("type", "Store Manager");
                roleData.put("authority", "Full Store Management");
                break;
            case "ADMIN":
                roleData.put("type", "System Administrator");
                roleData.put("authority", "System-wide Management");
                break;
            default:
                roleData.put("type", "Standard User");
        }

        return roleData;
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

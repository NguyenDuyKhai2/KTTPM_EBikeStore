package com.ebike.userModule.controller;

import com.ebike.authModule.entity.User;
import com.ebike.authModule.repository.UserRepository;
import com.ebike.userModule.entity.AddressType;
import com.ebike.userModule.entity.UserAddress;
import com.ebike.userModule.entity.UserPreference;
import com.ebike.userModule.repository.UserAddressRepository;
import com.ebike.userModule.repository.UserPreferenceRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public UserController(
        UserRepository userRepository,
        UserAddressRepository userAddressRepository,
        UserPreferenceRepository userPreferenceRepository
    ) {
        this.userRepository = userRepository;
        this.userAddressRepository = userAddressRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    @GetMapping("/{userId}")
    @Transactional(readOnly = true)
    public UserBasicResponse getUser(@PathVariable Long userId) {
        User user = getUserOrThrow(userId);
        return toUserBasicResponse(user);
    }

    @GetMapping("/{userId}/addresses")
    @Transactional(readOnly = true)
    public List<UserAddressResponse> getAddresses(@PathVariable Long userId) {
        validateUser(userId);
        return userAddressRepository.findByUserId(userId).stream()
            .sorted(Comparator.comparing(UserAddress::getId))
            .map(this::toAddressResponse)
            .toList();
    }

    @PostMapping("/{userId}/addresses")
    @Transactional
    @ResponseStatus(HttpStatus.CREATED)
    public UserAddressResponse createAddress(@PathVariable Long userId, @RequestBody UserAddressRequest request) {
        User user = getUserOrThrow(userId);

        UserAddress address = new UserAddress();
        address.setUser(user);
        address.setAddressType(parseAddressType(request == null ? null : request.addressType()));
        address.setStreet(request == null ? null : request.street());
        address.setCity(request == null ? null : request.city());
        address.setPostalCode(request == null ? null : request.postalCode());
        address.setCountry(request == null ? null : request.country());
        address.setDefaultAddress(request != null && Boolean.TRUE.equals(request.isDefault()));

        UserAddress saved = userAddressRepository.save(address);
        return toAddressResponse(saved);
    }

    @GetMapping("/{userId}/preferences")
    @Transactional(readOnly = true)
    public UserPreferenceResponse getPreferences(@PathVariable Long userId) {
        validateUser(userId);
        UserPreference preference = userPreferenceRepository.findByUserId(userId)
            .orElse(null);

        if (preference == null) {
            return new UserPreferenceResponse(userId, "light", "en", true);
        }

        return toPreferenceResponse(preference);
    }

    @PutMapping("/{userId}/preferences")
    @Transactional
    public UserPreferenceResponse upsertPreferences(@PathVariable Long userId, @RequestBody UserPreferenceRequest request) {
        User user = getUserOrThrow(userId);

        UserPreference preference = userPreferenceRepository.findByUserId(userId)
            .orElseGet(() -> {
                UserPreference created = new UserPreference();
                created.setUser(user);
                return created;
            });

        if (request != null && request.theme() != null && !request.theme().isBlank()) {
            preference.setTheme(request.theme().trim());
        }
        if (request != null && request.language() != null && !request.language().isBlank()) {
            preference.setLanguage(request.language().trim());
        }
        if (request != null && request.notificationsEnabled() != null) {
            preference.setNotificationsEnabled(request.notificationsEnabled());
        }

        UserPreference saved = userPreferenceRepository.save(preference);
        return toPreferenceResponse(saved);
    }

    private User getUserOrThrow(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void validateUser(Long userId) {
        getUserOrThrow(userId);
    }

    private AddressType parseAddressType(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return AddressType.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid addressType. Use BILLING or SHIPPING");
        }
    }

    private UserBasicResponse toUserBasicResponse(User user) {
        return new UserBasicResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getActive(),
            user.getVerified()
        );
    }

    private UserAddressResponse toAddressResponse(UserAddress address) {
        return new UserAddressResponse(
            address.getId(),
            address.getUser().getId(),
            address.getAddressType() == null ? null : address.getAddressType().name(),
            address.getStreet(),
            address.getCity(),
            address.getPostalCode(),
            address.getCountry(),
            address.getDefaultAddress()
        );
    }

    private UserPreferenceResponse toPreferenceResponse(UserPreference preference) {
        return new UserPreferenceResponse(
            preference.getUser().getId(),
            preference.getTheme(),
            preference.getLanguage(),
            preference.getNotificationsEnabled()
        );
    }

    public record UserAddressRequest(
        String addressType,
        String street,
        String city,
        String postalCode,
        String country,
        Boolean isDefault
    ) {
    }

    public record UserPreferenceRequest(String theme, String language, Boolean notificationsEnabled) {
    }

    public record UserBasicResponse(
        Long id,
        String username,
        String email,
        String firstName,
        String lastName,
        Boolean active,
        Boolean verified
    ) {
    }

    public record UserAddressResponse(
        Long id,
        Long userId,
        String addressType,
        String street,
        String city,
        String postalCode,
        String country,
        Boolean isDefault
    ) {
    }

    public record UserPreferenceResponse(Long userId, String theme, String language, Boolean notificationsEnabled) {
    }
}

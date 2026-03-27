package com.ebike.authModule.controller;

import com.ebike.authModule.dto.AuthResponse;
import com.ebike.authModule.dto.EnhancedAuthResponse;
import com.ebike.authModule.dto.LoginRequest;
import com.ebike.authModule.dto.RegisterRequest;
import com.ebike.authModule.dto.RoleSpecificLoginResponse;
import com.ebike.authModule.dto.UserProfileResponse;
import com.ebike.authModule.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String ROLE_CUSTOMER = "CUSTOMER";
    private static final String ROLE_STAFF = "STAFF";
    private static final String ROLE_MANAGER = "MANAGER";
    private static final String ROLE_ADMIN = "ADMIN";

    private final AuthenticationService authenticationService;

    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request, HttpServletRequest httpServletRequest) {
        return authenticationService.login(
            request,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @PostMapping("/login/enhanced")
    public EnhancedAuthResponse enhancedLogin(
        @RequestBody LoginRequest request,
        HttpServletRequest httpServletRequest
    ) {
        return authenticationService.enhancedLogin(
            request,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @PostMapping("/login/customer")
    public RoleSpecificLoginResponse customerLogin(
        @RequestBody LoginRequest request,
        HttpServletRequest httpServletRequest
    ) {
        return authenticationService.roleSpecificLogin(
            request,
            ROLE_CUSTOMER,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @PostMapping("/login/staff")
    public RoleSpecificLoginResponse staffLogin(
        @RequestBody LoginRequest request,
        HttpServletRequest httpServletRequest
    ) {
        return authenticationService.roleSpecificLogin(
            request,
            ROLE_STAFF,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @PostMapping("/login/manager")
    public RoleSpecificLoginResponse managerLogin(
        @RequestBody LoginRequest request,
        HttpServletRequest httpServletRequest
    ) {
        return authenticationService.roleSpecificLogin(
            request,
            ROLE_MANAGER,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @PostMapping("/login/admin")
    public RoleSpecificLoginResponse adminLogin(
        @RequestBody LoginRequest request,
        HttpServletRequest httpServletRequest
    ) {
        return authenticationService.roleSpecificLogin(
            request,
            ROLE_ADMIN,
            httpServletRequest.getRemoteAddr(),
            httpServletRequest.getHeader("User-Agent")
        );
    }

    @GetMapping("/profile")
    public UserProfileResponse getProfile(@RequestParam String usernameOrEmail) {
        return authenticationService.getProfile(usernameOrEmail);
    }

    @GetMapping("/verify-token")
    public boolean verifyToken(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return false;
        }
        String jwtToken = token.substring(7);
        return authenticationService.validateToken(jwtToken);
    }

    @GetMapping("/user-from-token")
    public String getUserFromToken(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return null;
        }
        String jwtToken = token.substring(7);
        if (authenticationService.validateToken(jwtToken)) {
            return authenticationService.extractUsernameFromToken(jwtToken);
        }
        return null;
    }
}

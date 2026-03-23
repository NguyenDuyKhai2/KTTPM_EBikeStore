package com.ebike.authModule.controller;

import com.ebike.authModule.dto.AuthResponse;
import com.ebike.authModule.dto.LoginRequest;
import com.ebike.authModule.dto.RegisterRequest;
import com.ebike.authModule.dto.UserProfileResponse;
import com.ebike.authModule.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

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

    @GetMapping("/profile")
    public UserProfileResponse getProfile(@RequestParam String usernameOrEmail) {
        return authenticationService.getProfile(usernameOrEmail);
    }
}

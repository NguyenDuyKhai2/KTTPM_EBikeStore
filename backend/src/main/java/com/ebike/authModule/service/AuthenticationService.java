package com.ebike.authModule.service;

import com.ebike.authModule.dto.AuthResponse;
import com.ebike.authModule.dto.LoginRequest;
import com.ebike.authModule.dto.RegisterRequest;
import com.ebike.authModule.dto.UserProfileResponse;

public interface AuthenticationService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request, String ipAddress, String userAgent);

    UserProfileResponse getProfile(String usernameOrEmail);
}

package com.ebike.authModule.dto;

public record RoleSpecificLoginResponse(
    String role,
    Object roleData,
    EnhancedAuthResponse authResponse
) {
}

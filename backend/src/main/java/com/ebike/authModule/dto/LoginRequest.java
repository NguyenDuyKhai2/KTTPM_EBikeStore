package com.ebike.authModule.dto;

public record LoginRequest(
    String usernameOrEmail,
    String password
) {
}

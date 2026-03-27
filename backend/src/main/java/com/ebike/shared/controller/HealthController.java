package com.ebike.shared.controller;

import java.time.OffsetDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Value("${spring.application.name:ebike-backend}")
    private String applicationName;

    @GetMapping
    public HealthResponse health() {
        return new HealthResponse("UP", applicationName, OffsetDateTime.now().toString());
    }

    public record HealthResponse(String status, String application, String timestamp) {
    }
}

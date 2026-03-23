package com.ebike.chatbotModule.dto;

import java.math.BigDecimal;

public record ChatbotRecommendationDto(
    Long id,
    String name,
    String slug,
    BigDecimal price,
    String reason
) {
}

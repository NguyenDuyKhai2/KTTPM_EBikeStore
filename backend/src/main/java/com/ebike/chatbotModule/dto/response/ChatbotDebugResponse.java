package com.ebike.chatbotModule.dto.response;

import java.util.List;

public record ChatbotDebugResponse(
    String message,
    String normalizedMessage,
    String matchedFaqQuestion,
    String matchedFaqCategory,
    String matchedIntent,
    boolean geminiConfigured,
    String showroomContext,
    String orderPaymentContext,
    String fallbackAnswer,
    List<ChatbotRecommendationDto> recommendations
) {
}

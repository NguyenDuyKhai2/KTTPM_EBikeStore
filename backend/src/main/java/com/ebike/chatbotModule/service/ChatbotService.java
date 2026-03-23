package com.ebike.chatbotModule.service;

import com.ebike.chatbotModule.dto.ChatbotAskRequest;
import com.ebike.chatbotModule.dto.ChatbotRecommendationDto;
import com.ebike.chatbotModule.dto.ChatbotResponse;
import com.ebike.productModule.entity.Product;
import com.ebike.productModule.entity.ProductSpecification;
import com.ebike.productModule.repository.ProductRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ChatbotService {

    private final ProductRepository productRepository;
    private final List<FaqEntry> faqEntries = new ArrayList<>();

    public ChatbotService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        loadFaqEntries();
    }

    public ChatbotResponse ask(ChatbotAskRequest request) {
        if (request == null || request.message() == null || request.message().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "message is required");
        }

        String normalizedMessage = request.message().trim().toLowerCase(Locale.ROOT);

        FaqEntry faqMatch = faqEntries.stream()
            .filter(entry -> entry.matches(normalizedMessage))
            .max(Comparator.comparingInt(FaqEntry::priorityScore))
            .orElse(null);

        List<ChatbotRecommendationDto> recommendations = findProductRecommendations(normalizedMessage);

        if (faqMatch != null && !recommendations.isEmpty()) {
            return new ChatbotResponse(
                faqMatch.answer() + " Based on your question, here are some products you may want to review.",
                "faq+product_recommendation",
                recommendations
            );
        }

        if (faqMatch != null) {
            return new ChatbotResponse(faqMatch.answer(), "faq", List.of());
        }

        if (!recommendations.isEmpty()) {
            return new ChatbotResponse(
                "I found a few e-bike options that may match your needs.",
                "product_recommendation",
                recommendations
            );
        }

        return new ChatbotResponse(
            "I can help with product recommendations, range, speed, battery, warranty, shipping, and payment questions.",
            "fallback",
            List.of()
        );
    }

    private List<ChatbotRecommendationDto> findProductRecommendations(String message) {
        return productRepository.findAll().stream()
            .filter(product -> Boolean.TRUE.equals(product.getActive()))
            .map(product -> scoreProduct(product, message))
            .filter(scoredProduct -> scoredProduct.score() > 0)
            .sorted(Comparator.comparingInt(ScoredProduct::score).reversed())
            .limit(3)
            .map(scoredProduct -> new ChatbotRecommendationDto(
                scoredProduct.product().getId(),
                scoredProduct.product().getName(),
                scoredProduct.product().getSlug(),
                scoredProduct.product().getPrice(),
                scoredProduct.reason()
            ))
            .toList();
    }

    private ScoredProduct scoreProduct(Product product, String message) {
        int score = 0;
        List<String> reasons = new ArrayList<>();
        ProductSpecification specification = product.getSpecification();

        if (containsAny(message, "cheap", "budget", "student", "gia re", "duoi 20", "under 20")) {
            BigDecimal threshold = BigDecimal.valueOf(20_000_000L);
            if (product.getPrice() != null && product.getPrice().compareTo(threshold) <= 0) {
                score += 3;
                reasons.add("fits a budget-friendly preference");
            }
        }

        if (containsAny(message, "fast", "speed", "toc do") && specification != null && specification.getMaxSpeedKmh() != null) {
            if (specification.getMaxSpeedKmh().compareTo(BigDecimal.valueOf(50)) >= 0) {
                score += 3;
                reasons.add("offers strong max speed");
            }
        }

        if (containsAny(message, "far", "range", "quang duong", "long distance") && specification != null
            && specification.getMaxRangeKm() != null) {
            if (specification.getMaxRangeKm().compareTo(BigDecimal.valueOf(70)) >= 0) {
                score += 3;
                reasons.add("supports longer travel range");
            }
        }

        if (containsAny(message, "battery", "pin") && specification != null && specification.getBatteryType() != null) {
            score += 1;
            reasons.add("matches a battery-focused query");
        }

        if (containsAny(message, "scooter", "xe tay ga", "e_scooter")
            && specification != null && specification.getVehicleType() != null
            && specification.getVehicleType().name().contains("SCOOTER")) {
            score += 2;
            reasons.add("is in the scooter category");
        }

        if (containsAny(message, "bike", "xe dap", "ebike")
            && specification != null && specification.getVehicleType() != null
            && specification.getVehicleType().name().contains("BIKE")) {
            score += 2;
            reasons.add("is in the e-bike category");
        }

        if (score == 0 && containsAny(message, product.getName().toLowerCase(Locale.ROOT), product.getSlug().toLowerCase(Locale.ROOT))) {
            score = 1;
            reasons.add("closely matches the product name you mentioned");
        }

        String reason = reasons.isEmpty() ? "matches your request" : String.join(", ", reasons);
        return new ScoredProduct(product, score, reason);
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword.toLowerCase(Locale.ROOT))) {
                return true;
            }
        }
        return false;
    }

    private void loadFaqEntries() {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
            new ClassPathResource("faq-data/faq.csv").getInputStream(),
            StandardCharsets.UTF_8
        ))) {
            reader.readLine();
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank() || line.equals("...")) {
                    continue;
                }
                String[] parts = line.split(",", 6);
                if (parts.length < 6) {
                    continue;
                }
                faqEntries.add(new FaqEntry(
                    parts[1].trim(),
                    parts[2].trim(),
                    parts[3].trim(),
                    parts[4].trim(),
                    parts[5].trim()
                ));
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load FAQ data", exception);
        }
    }

    private record FaqEntry(
        String category,
        String question,
        String answer,
        String keywords,
        String priority
    ) {
        boolean matches(String message) {
            String normalizedQuestion = question.toLowerCase(Locale.ROOT);
            if (message.contains(normalizedQuestion)) {
                return true;
            }
            for (String keyword : keywords.toLowerCase(Locale.ROOT).split(" ")) {
                if (!keyword.isBlank() && message.contains(keyword)) {
                    return true;
                }
            }
            return false;
        }

        int priorityScore() {
            return switch (priority.toLowerCase(Locale.ROOT)) {
                case "high" -> 3;
                case "medium" -> 2;
                default -> 1;
            };
        }
    }

    private record ScoredProduct(Product product, int score, String reason) {
    }
}

package com.ebike.chatbotModule.service;

import com.ebike.chatbotModule.config.GeminiChatProperties;
import java.util.List;
import java.util.Map;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Component
public class GeminiChatClient {

    private final GeminiChatProperties properties;
    private final RestTemplate restTemplate;

    public GeminiChatClient(GeminiChatProperties properties, RestTemplateBuilder restTemplateBuilder) {
        this.properties = properties;
        this.restTemplate = restTemplateBuilder.build();
    }

    public boolean isConfigured() {
        return properties.isEnabled() && properties.getApiKey() != null && !properties.getApiKey().isBlank();
    }

    @SuppressWarnings("unchecked")
    public String generateAnswer(String prompt) {
        if (!isConfigured()) {
            return null;
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
            + properties.getModel()
            + ":generateContent?key="
            + properties.getApiKey();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", prompt))
            )),
            "generationConfig", Map.of(
                "temperature", 0.35,
                "maxOutputTokens", 700
            )
        );

        try {
            Map<String, Object> response = restTemplate.postForObject(url, new HttpEntity<>(requestBody, headers), Map.class);
            if (response == null) {
                return null;
            }
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return null;
            }
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) {
                return null;
            }
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                return null;
            }
            Object text = parts.get(0).get("text");
            return text == null ? null : text.toString().trim();
        } catch (RestClientException exception) {
            return null;
        }
    }
}

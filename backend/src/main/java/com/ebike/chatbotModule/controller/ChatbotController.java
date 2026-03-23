package com.ebike.chatbotModule.controller;

import com.ebike.chatbotModule.dto.ChatbotAskRequest;
import com.ebike.chatbotModule.dto.ChatbotResponse;
import com.ebike.chatbotModule.service.ChatbotService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/ask")
    public ChatbotResponse ask(@RequestBody ChatbotAskRequest request) {
        return chatbotService.ask(request);
    }
}

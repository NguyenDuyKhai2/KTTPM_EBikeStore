import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { ChatResponse, Message } from "../types";

export const chatbotAPI = {
  sendMessage: async (content: string) => {
    const response = await apiClient.post<ChatResponse>(API_ENDPOINTS.chat.message, { content });
    return response.data;
  },
  getHistory: async () => {
    const response = await apiClient.get<Message[]>(API_ENDPOINTS.chat.history);
    return response.data;
  }
};

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const authAPI = {
  login: async (payload: LoginRequest) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, payload);
    return response.data;
  },
  register: async (payload: RegisterRequest) => {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.register, payload);
    return response.data;
  }
};

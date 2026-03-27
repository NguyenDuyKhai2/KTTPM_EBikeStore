import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { EnhancedAuthResponse, LoginRequest, RegisterRequest, UserProfileResponse } from "../types";

export const authAPI = {
  login: async (payload: LoginRequest) => {
    const response = await apiClient.post<EnhancedAuthResponse>(API_ENDPOINTS.auth.enhancedLogin, payload);
    return response.data;
  },
  register: async (payload: RegisterRequest) => {
    const response = await apiClient.post(API_ENDPOINTS.auth.register, payload);
    return response.data;
  },
  getProfile: async (usernameOrEmail: string) => {
    const response = await apiClient.get<UserProfileResponse>(API_ENDPOINTS.auth.profile, {
      params: { usernameOrEmail }
    });
    return response.data;
  },
  getUserFromToken: async () => {
    const response = await apiClient.get<string>(API_ENDPOINTS.auth.userFromToken);
    return response.data;
  }
};

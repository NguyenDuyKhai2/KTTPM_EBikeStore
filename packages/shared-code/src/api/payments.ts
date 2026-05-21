import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { VnPayCreatePaymentRequest, VnPayCreatePaymentResponse, VnPayReturnResponse } from "../types";

export const paymentAPI = {
  createVnPayPayment: async (request: VnPayCreatePaymentRequest) => {
    const response = await apiClient.post<VnPayCreatePaymentResponse>(API_ENDPOINTS.payments.vnpayCreate, request);
    return response.data;
  },

  getVnPayReturnResult: async (queryString: string) => {
    const response = await apiClient.get<VnPayReturnResponse>(`${API_ENDPOINTS.payments.vnpayReturn}?${queryString}`);
    return response.data;
  }
};

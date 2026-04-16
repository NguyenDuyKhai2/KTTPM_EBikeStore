import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Payment, VnPayCreatePaymentRequest, VnPayCreatePaymentResponse, VnPayReturnResponse } from "../types";

export const paymentAPI = {
  createPayment: async (amount: number, method: string) => {
    const response = await apiClient.post<Payment>(API_ENDPOINTS.payments.create, { amount, method });
    return response.data;
  },

  createVnPayPayment: async (request: VnPayCreatePaymentRequest) => {
    const response = await apiClient.post<VnPayCreatePaymentResponse>(API_ENDPOINTS.payments.vnpayCreate, request);
    return response.data;
  },

  getVnPayReturnResult: async (queryString: string) => {
    const response = await apiClient.get<VnPayReturnResponse>(`${API_ENDPOINTS.payments.vnpayReturn}?${queryString}`);
    return response.data;
  }
};

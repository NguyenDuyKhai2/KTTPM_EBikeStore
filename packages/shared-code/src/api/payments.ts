import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Payment } from "../types";

export const paymentAPI = {
  createPayment: async (amount: number, method: string) => {
    const response = await apiClient.post<Payment>(API_ENDPOINTS.payments.create, { amount, method });
    return response.data;
  }
};

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type {
  ManagerCustomer,
  ManagerDashboard,
  ManagerPayment,
  ManagerPaymentConfirmationRequest
} from "../types";

export const managerAPI = {
  getDashboard: async () => {
    const response = await apiClient.get<ManagerDashboard>(API_ENDPOINTS.manager.dashboard);
    return response.data;
  },
  getPayments: async (params?: {
    paymentStatus?: string;
    paymentMethod?: string;
    search?: string;
  }) => {
    const response = await apiClient.get<ManagerPayment[]>(API_ENDPOINTS.manager.payments, { params });
    return response.data;
  },
  confirmPayment: async (paymentId: number, payload?: ManagerPaymentConfirmationRequest) => {
    const response = await apiClient.patch<ManagerPayment>(API_ENDPOINTS.manager.paymentConfirm(paymentId), payload);
    return response.data;
  },
  getCustomers: async (search?: string) => {
    const response = await apiClient.get<ManagerCustomer[]>(API_ENDPOINTS.manager.customers, {
      params: search ? { search } : undefined
    });
    return response.data;
  }
};

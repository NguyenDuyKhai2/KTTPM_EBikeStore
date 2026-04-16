import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { CreateOrderRequest, Order, OrderQuote, OrderQuoteRequest } from "../types";

export const orderAPI = {
  list: async (userId?: number) => {
    const response = await apiClient.get<Order[]>(API_ENDPOINTS.orders.list, {
      params: userId ? { userId } : undefined
    });
    return response.data;
  },
  getDetail: async (id: string) => {
    const response = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(id));
    return response.data;
  },
  quote: async (payload: OrderQuoteRequest) => {
    const response = await apiClient.post<OrderQuote>(API_ENDPOINTS.orders.quote, payload);
    return response.data;
  },
  create: async (payload: CreateOrderRequest) => {
    const response = await apiClient.post<Order>(API_ENDPOINTS.orders.create, payload);
    return response.data;
  }
};

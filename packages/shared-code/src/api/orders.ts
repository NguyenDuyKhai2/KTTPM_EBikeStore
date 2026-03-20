import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Order } from "../types";

export const orderAPI = {
  list: async () => {
    const response = await apiClient.get<Order[]>(API_ENDPOINTS.orders.list);
    return response.data;
  },
  getDetail: async (id: string) => {
    const response = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(id));
    return response.data;
  }
};

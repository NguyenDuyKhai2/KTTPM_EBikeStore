import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Cart } from "../types";

export const cartAPI = {
  getCart: async () => {
    const response = await apiClient.get<Cart>(API_ENDPOINTS.cart.current);
    return response.data;
  }
};

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Product, ProductFilter } from "../types";

export const productAPI = {
  list: async (filters?: ProductFilter) => {
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list, { params: filters });
    return response.data;
  },
  getDetail: async (id: string) => {
    const response = await apiClient.get<Product>(API_ENDPOINTS.products.detail(id));
    return response.data;
  }
};

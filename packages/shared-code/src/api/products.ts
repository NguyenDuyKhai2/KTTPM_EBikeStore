import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { Product, ProductFilter, ProductDetail, ProductFilterOptions } from "../types";

export const productAPI = {
  list: async (filters?: ProductFilter) => {
    const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list, { params: filters });
    return response.data;
  },
  filterOptions: async () => {
    const response = await apiClient.get<ProductFilterOptions>(API_ENDPOINTS.products.filterOptions);
    return response.data;
  },
  getDetail: async (id: string) => {
    const response = await apiClient.get<ProductDetail>(API_ENDPOINTS.products.detail(id));
    return response.data;
  }
};

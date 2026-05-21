import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface AdminProductImage {
  id: number;
  productId: number;
  variantId?: number | null;
  imageUrl: string;
  altText?: string | null;
  sortOrder: number;
  primaryImage: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const adminProductImageAPI = {
  list: async (productId: number) => {
    const response = await apiClient.get<AdminProductImage[]>(API_ENDPOINTS.adminProductImages.list, {
      params: { productId }
    });
    return response.data;
  },
  upload: async (
    productId: number,
    file: File,
    options?: { altText?: string; sortOrder?: number; primaryImage?: boolean; variantId?: number }
  ) => {
    const formData = new FormData();
    formData.append("productId", String(productId));
    formData.append("file", file);
    if (options?.altText) {
      formData.append("altText", options.altText);
    }
    if (options?.sortOrder != null) {
      formData.append("sortOrder", String(options.sortOrder));
    }
    if (options?.primaryImage != null) {
      formData.append("primaryImage", String(options.primaryImage));
    }
    if (options?.variantId != null) {
      formData.append("variantId", String(options.variantId));
    }
    const response = await apiClient.post<AdminProductImage>(API_ENDPOINTS.adminProductImages.list, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },
  setPrimary: async (imageId: number) => {
    const formData = new FormData();
    formData.append("primaryImage", "true");
    const response = await apiClient.put<AdminProductImage>(API_ENDPOINTS.adminProductImages.detail(imageId), formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },
  delete: async (imageId: number) => {
    await apiClient.delete(API_ENDPOINTS.adminProductImages.detail(imageId));
  }
};

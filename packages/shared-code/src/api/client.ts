import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/api.config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true
});

type ApiErrorBody = {
  message?: string;
  detail?: string;
  error?: string;
  status?: number;
};

const extractApiErrorMessage = (error: AxiosError<ApiErrorBody>) => {
  const body = error.response?.data;
  if (body?.message) {
    return body.message;
  }
  if (body?.detail) {
    return body.detail;
  }
  if (body?.error) {
    return body.error;
  }
  return error.message;
};

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => Promise.reject(new Error(extractApiErrorMessage(error)))
);

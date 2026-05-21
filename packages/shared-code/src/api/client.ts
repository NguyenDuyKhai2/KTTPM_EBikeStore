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

// Store reference to the token getter function - will be set by setupAuthInterceptor
let getAuthToken: (() => string | null) | null = null;

/**
 * Setup auth interceptor with access to Redux store token.
 * Call this once after store is created.
 */
export const setupAuthInterceptor = (tokenGetter: () => string | null) => {
  getAuthToken = tokenGetter;
};

// Request interceptor: Add token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    // Handle 401 Unauthorized - could implement token refresh here if needed
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout here
      // For now, just pass the error through to be handled by the app
    }
    return Promise.reject(new Error(extractApiErrorMessage(error)));
  }
);

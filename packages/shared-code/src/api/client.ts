import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true
});

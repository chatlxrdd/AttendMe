import axios from "axios";
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = "https://attendme-backend.runasp.net";

export interface AuthResponse {
  token: string;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Jeśli nie przekażemy tokena to użyje z localStorage
  if (!config.headers.Authorization) {
    useAuthStore().checkAuth();
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
(error) => {
  return Promise.reject(error);
});

export default apiClient;

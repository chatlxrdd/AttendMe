import axios from "axios";

const API_BASE_URL = "https://attendme-backend.runasp.net";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Jeśli nie przekażemy tokena to użyje z localStorage
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;

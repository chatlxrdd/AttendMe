import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://attendme-backend.runasp.net/api', // Adres backendu
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
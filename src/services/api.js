import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';

export const isMock = API_CONFIG.useMock;

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
    return Promise.reject(error?.response?.data || error);
  }
);

/** شبیه‌سازی تأخیر شبکه برای حالت Mock */
export function mockDelay(data, ms = 350) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** شبیه‌سازی خطای شبکه برای حالت Mock */
export function mockReject(message, ms = 350) {
  return new Promise((_, reject) =>
    setTimeout(() => reject({ message }), ms)
  );
}

export default api;

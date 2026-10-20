import axios from 'axios';

import { authToken } from '@/auth/keycloak';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const createAxiosInstance = (resourcePath: string) => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}${resourcePath}`,
  });
  instance.interceptors.request.use(async (config) => {
    const token = await authToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
};

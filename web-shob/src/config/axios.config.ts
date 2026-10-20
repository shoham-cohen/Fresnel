import axios, { HttpStatusCode, isAxiosError } from 'axios';

import { authToken } from '@/auth/keycloak';
import { reportUnauthorized } from '@/auth/unauthorized.store';

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
  instance.interceptors.response.use(undefined, (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized) {
      reportUnauthorized();
    }
    throw error;
  });
  return instance;
};

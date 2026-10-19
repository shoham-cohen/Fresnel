import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const createAxiosInstance = (resourcePath: string) => {
  return axios.create({
    baseURL: `${API_BASE_URL}${resourcePath}`,
  });
};

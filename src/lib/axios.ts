import axios from "axios";

import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

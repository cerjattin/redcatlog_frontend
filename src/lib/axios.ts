import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/lib/env";
import { useAuthStore } from "@/store/auth.store";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
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

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      const { data } = await axios.post<{
        accessToken: string;
        refreshToken?: string;
      }>(`${env.apiBaseUrl}/auth/refresh`, {
        refreshToken,
      });

      useAuthStore
        .getState()
        .setTokens(data.accessToken, data.refreshToken ?? refreshToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    }
  },
);
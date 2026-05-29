import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AxiosError } from "axios";

import { authService } from "@/features/auth/api/auth.service";
import type {
  LoginRequest,
  RegisterRequest,
} from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/types/user.types";

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return responseData?.message ?? responseData?.error ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;

  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  loadMe: () => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: "idle",
      error: null,

      async login(payload) {
        set({ status: "loading", error: null });

        try {
          const response = await authService.login(payload);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken ?? null,
            status: "authenticated",
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: "unauthenticated",
            error: getApiErrorMessage(error, "No fue posible iniciar sesión"),
          });

          return;
        }
      },

      async register(payload) {
        set({ status: "loading", error: null });

        try {
          const response = await authService.register(payload);

          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken ?? null,
            status: "authenticated",
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: "unauthenticated",
            error: getApiErrorMessage(
              error,
              "No fue posible completar el registro",
            ),
          });

          return;
        }
      },

      async loadMe() {
        const token = get().accessToken;

        if (!token) {
          set({ status: "unauthenticated" });
          return;
        }

        set({ status: "loading", error: null });

        try {
          const response = await authService.me();

          set({
            user: response.user,
            status: "authenticated",
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: "unauthenticated",
            error:
              error instanceof Error
                ? error.message
                : "No fue posible validar la sesión",
          });
        }
      },

      async logout() {
        try {
          await authService.logout();
        } finally {
          get().clearAuth();
        }
      },

      setTokens(accessToken, refreshToken) {
        set({
          accessToken,
          refreshToken: refreshToken ?? get().refreshToken,
        });
      },

      clearAuth() {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          status: "unauthenticated",
          error: null,
        });

        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "red-mujeres-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

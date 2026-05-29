import { api } from "@/lib/axios";
import type {
  AdminResetPasswordPayload,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ForgotPasswordResult,
  PasswordResult,
  ResetPasswordPayload,
} from "@/features/auth/types/password.types";

type PasswordEnvelope = {
  success: boolean;
  message: string;
  data: PasswordResult;
};

type ForgotPasswordEnvelope = {
  success: boolean;
  message: string;
  data: ForgotPasswordResult;
};

export const passwordService = {
  async adminResetUserPassword(
    userId: string,
    payload: AdminResetPasswordPayload,
  ): Promise<PasswordResult> {
    const { data } = await api.patch<PasswordEnvelope>(
      `/users/${userId}/password`,
      payload,
    );

    return data.data;
  },

  async changeMyPassword(
    payload: ChangePasswordPayload,
  ): Promise<PasswordResult> {
    const { data } = await api.patch<PasswordEnvelope>(
      "/auth/change-password",
      payload,
    );

    return data.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload,
  ): Promise<ForgotPasswordResult> {
    const { data } = await api.post<ForgotPasswordEnvelope>(
      "/auth/forgot-password",
      payload,
    );

    return data.data;
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<PasswordResult> {
    const { data } = await api.post<PasswordEnvelope>(
      "/auth/reset-password",
      payload,
    );

    return data.data;
  },
};

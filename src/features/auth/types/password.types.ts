export type AdminResetPasswordPayload = {
  newPassword: string;
  forcePasswordChange?: boolean;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type PasswordResult = {
  id: string;
  email: string;
  forcePasswordChange: boolean;
  passwordChangedAt: string | null;
};

export type ForgotPasswordResult = {
  message: string;
  resetToken?: string;
  expiresInMinutes?: number;
};

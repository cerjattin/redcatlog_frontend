import type { AuthUser, UserRole, UserStatus } from "@/types/user.types";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  department?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type BackendRole = {
  id: string;
  name: UserRole;
};

export type BackendUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  profilePhotoUrl?: string | null;
  bio?: string | null;
  city?: string | null;
  department?: string | null;
  country?: string | null;
  status: UserStatus;
  role: BackendRole;
  entrepreneur?: {
    id: string;
    status: string;
  } | null;
};

export type BackendAuthEnvelope = {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

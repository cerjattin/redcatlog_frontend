import { api } from "@/lib/axios";
import type {
  AuthResponse,
  BackendAuthEnvelope,
  BackendUser,
  LoginRequest,
  MeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from "@/features/auth/types/auth.types";
import type { AuthUser } from "@/types/user.types";

function mapBackendUser(user: BackendUser): AuthUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role.name,
    status: user.status,
    phone: user.phone ?? null,
    whatsapp: user.whatsapp ?? null,
    city: user.city ?? null,
    department: user.department ?? null,
    country: user.country ?? null,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    bio: user.bio ?? null,
  };
}

function mapAuthEnvelope(response: BackendAuthEnvelope): AuthResponse {
  return {
    user: mapBackendUser(response.data.user),
    accessToken: response.data.tokens.accessToken,
    refreshToken: response.data.tokens.refreshToken,
  };
}

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<BackendAuthEnvelope>(
      "/auth/login",
      payload,
    );

    return mapAuthEnvelope(data);
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<BackendAuthEnvelope>(
      "/auth/register",
      payload,
    );

    return mapAuthEnvelope(data);
  },

  async me(): Promise<MeResponse> {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: BackendUser;
    }>("/auth/me");

    return {
      user: mapBackendUser(data.data),
    };
  },

  async refresh(payload: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { data } = await api.post<{
      data: {
        tokens: {
          accessToken: string;
          refreshToken?: string;
        };
      };
    }>("/auth/refresh", payload);

    return {
      accessToken: data.data.tokens.accessToken,
      refreshToken: data.data.tokens.refreshToken,
    };
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

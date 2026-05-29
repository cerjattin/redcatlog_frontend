import { api } from "@/lib/axios";
import type {
  AdminUser,
  AdminUsersListQuery,
  AdminUsersListResponse,
  UpdateUserStatusPayload,
} from "@/features/admin/users/types/adminUser.types";

type AdminUsersListEnvelope = {
  success: boolean;
  message: string;
  data: AdminUsersListResponse;
};

type AdminUserEnvelope = {
  success: boolean;
  message: string;
  data: AdminUser;
};

function buildQueryParams(query: AdminUsersListQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const adminUserService = {
  async listUsers(
    query: AdminUsersListQuery = {},
  ): Promise<AdminUsersListResponse> {
    const queryString = buildQueryParams(query);

    const { data } = await api.get<AdminUsersListEnvelope>(
      queryString ? `/users?${queryString}` : "/users",
    );

    return data.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const { data } = await api.get<AdminUserEnvelope>(`/users/${id}`);

    return data.data;
  },

  async updateUserStatus(
    id: string,
    payload: UpdateUserStatusPayload,
  ): Promise<AdminUser> {
    const { data } = await api.patch<AdminUserEnvelope>(
      `/users/${id}/status`,
      payload,
    );

    return data.data;
  },
};

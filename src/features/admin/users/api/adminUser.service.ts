import { api } from "@/lib/axios";

import type {
  AdminUser,
  AdminUsersListQuery,
  AdminUsersListResponse,
  UpdateUserStatusPayload,
} from "@/features/admin/users/types/adminUser.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: AdminUsersListQuery) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  );
}

function getDataFromPayload(payload: unknown) {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function normalizeListResponse(payload: unknown): AdminUsersListResponse {
  const data = getDataFromPayload(payload);

  if (isRecord(data)) {
    const items = Array.isArray(data.items)
      ? (data.items as AdminUser[])
      : Array.isArray(data.users)
        ? (data.users as AdminUser[])
        : [];

    const paginationData = isRecord(data.pagination) ? data.pagination : null;

    return {
      items,
      pagination: {
        page: Number(paginationData?.page ?? 1),
        limit: Number(paginationData?.limit ?? 10),
        total: Number(paginationData?.total ?? items.length),
        totalPages: Number(paginationData?.totalPages ?? 1),
      },
    };
  }

  return {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
    },
  };
}

function normalizeUserResponse(payload: unknown): AdminUser {
  const data = getDataFromPayload(payload);

  if (isRecord(data) && isRecord(data.user)) {
    return data.user as unknown as AdminUser;
  }

  return data as unknown as AdminUser;
}

export const adminUserService = {
  async listUsers(
    params?: AdminUsersListQuery,
  ): Promise<AdminUsersListResponse> {
    const response = await api.get<unknown>("/users", {
      params: cleanParams(params),
    });

    return normalizeListResponse(response.data);
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<unknown>(`/users/${id}`);

    return normalizeUserResponse(response.data);
  },

  async updateUserStatus(
    id: string,
    payload: UpdateUserStatusPayload,
  ): Promise<AdminUser> {
    const response = await api.patch<unknown>(`/users/${id}/status`, payload);

    return normalizeUserResponse(response.data);
  },
};

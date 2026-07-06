import { api } from "@/lib/axios";

import type {
  AdminEntrepreneur,
  AdminEntrepreneurListQuery,
  AdminEntrepreneurListResponse,
  CreateEntrepreneurRequest,
  RejectEntrepreneurRequest,
  UpdateEntrepreneurRequest,
  UpdateEntrepreneurStatusRequest,
} from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: AdminEntrepreneurListQuery) {
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

function normalizeListResponse(
  payload: unknown,
): AdminEntrepreneurListResponse {
  const data = getDataFromPayload(payload);

  if (isRecord(data)) {
    const items = Array.isArray(data.items)
      ? (data.items as AdminEntrepreneur[])
      : Array.isArray(data.entrepreneurs)
        ? (data.entrepreneurs as AdminEntrepreneur[])
        : [];

    const pagination = isRecord(data.pagination)
      ? {
          page: Number(data.pagination.page ?? 1),
          limit: Number(data.pagination.limit ?? 10),
          total: Number(data.pagination.total ?? items.length),
          totalPages: Number(data.pagination.totalPages ?? 1),
          hasNextPage: Boolean(data.pagination.hasNextPage),
          hasPrevPage:
            Boolean(data.pagination.hasPrevPage) ||
            Boolean(data.pagination.hasPreviousPage),
        }
      : {
          page: 1,
          limit: 10,
          total: items.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        };

    return {
      items,
      pagination,
    };
  }

  return {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
}

function normalizeEntrepreneurResponse(payload: unknown): AdminEntrepreneur {
  const data = getDataFromPayload(payload);

  if (isRecord(data) && isRecord(data.entrepreneur)) {
    return data.entrepreneur as unknown as AdminEntrepreneur;
  }

  return data as unknown as AdminEntrepreneur;
}

export const adminEntrepreneurService = {
  async listEntrepreneurs(
    params?: AdminEntrepreneurListQuery,
  ): Promise<AdminEntrepreneurListResponse> {
    const response = await api.get<unknown>("/entrepreneurs", {
      params: cleanParams(params),
    });

    return normalizeListResponse(response.data);
  },

  async getEntrepreneurById(id: string): Promise<AdminEntrepreneur> {
    const response = await api.get<unknown>(`/entrepreneurs/${id}`);

    return normalizeEntrepreneurResponse(response.data);
  },

  async createEntrepreneur(
    payload: CreateEntrepreneurRequest,
  ): Promise<AdminEntrepreneur> {
    const response = await api.post<unknown>("/entrepreneurs", payload);

    return normalizeEntrepreneurResponse(response.data);
  },

  async updateEntrepreneur(
    id: string,
    payload: UpdateEntrepreneurRequest,
  ): Promise<AdminEntrepreneur> {
    const response = await api.put<unknown>(`/entrepreneurs/${id}`, payload);

    return normalizeEntrepreneurResponse(response.data);
  },

  async approveEntrepreneur(id: string): Promise<AdminEntrepreneur> {
    const response = await api.patch<unknown>(`/entrepreneurs/${id}/approve`);

    return normalizeEntrepreneurResponse(response.data);
  },

  async rejectEntrepreneur(
    id: string,
    payload: RejectEntrepreneurRequest,
  ): Promise<AdminEntrepreneur> {
    const response = await api.patch<unknown>(
      `/entrepreneurs/${id}/reject`,
      payload,
    );

    return normalizeEntrepreneurResponse(response.data);
  },

  async updateEntrepreneurStatus(
    id: string,
    payload: UpdateEntrepreneurStatusRequest,
  ): Promise<AdminEntrepreneur> {
    const response = await api.patch<unknown>(
      `/entrepreneurs/${id}/status`,
      payload,
    );

    return normalizeEntrepreneurResponse(response.data);
  },
};

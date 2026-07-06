import { api } from "@/lib/axios";

import type {
  AdminEntrepreneur,
  AdminEntrepreneurListQuery,
  AdminEntrepreneurListResponse,
  CreateEntrepreneurRequest,
  RejectEntrepreneurRequest,
  UpdateEntrepreneurRequest,
  UpdateEntrepreneurStatusRequest,
  UploadEntrepreneurImageResponse,
} from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";

type UnknownRecord = Record<string, unknown>;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

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

function normalizeUploadImageResponse(
  payload: unknown,
): UploadEntrepreneurImageResponse {
  const data = getDataFromPayload(payload);

  return data as unknown as UploadEntrepreneurImageResponse;
}

function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG o WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`La imagen no puede superar ${MAX_IMAGE_SIZE_MB} MB.`);
  }
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

  async uploadEntrepreneurImage(
    file: File,
    metadata?: {
      title?: string;
      description?: string;
      altText?: string;
    },
  ): Promise<UploadEntrepreneurImageResponse> {
    validateImageFile(file);

    const formData = new FormData();
    formData.append("image", file, file.name);

    if (metadata?.title) {
      formData.append("title", metadata.title);
    }

    if (metadata?.description) {
      formData.append("description", metadata.description);
    }

    if (metadata?.altText) {
      formData.append("altText", metadata.altText);
    }

    const response = await api.post<unknown>(
      "/uploads/images/entrepreneurs",
      formData,
    );

    return normalizeUploadImageResponse(response.data);
  },
};

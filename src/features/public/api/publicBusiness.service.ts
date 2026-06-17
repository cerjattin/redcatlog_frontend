import { api } from "@/lib/axios";

import type {
  GetPublicBusinessesParams,
  PublicBusinessesData,
  PublicBusinessesPagination,
  PublicBusiness,
} from "@/features/public/types/publicBusiness.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: GetPublicBusinessesParams) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  );
}

function buildDefaultPagination(
  total: number,
  page = 1,
  limit = 12,
): PublicBusinessesPagination {
  const safeLimit = limit > 0 ? limit : 12;
  const totalPages = Math.max(Math.ceil(total / safeLimit), 1);

  return {
    page,
    limit: safeLimit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

function getDataFromPayload(payload: unknown) {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function getBusinessesFromData(data: unknown): PublicBusiness[] {
  if (Array.isArray(data)) {
    return data as PublicBusiness[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as PublicBusiness[];
  }

  if (isRecord(data) && Array.isArray(data.businesses)) {
    return data.businesses as PublicBusiness[];
  }

  if (isRecord(data) && Array.isArray(data.entrepreneurs)) {
    return data.entrepreneurs as PublicBusiness[];
  }

  return [];
}

function getPaginationFromData(
  data: unknown,
  businesses: PublicBusiness[],
): PublicBusinessesPagination {
  if (isRecord(data) && isRecord(data.pagination)) {
    const page = Number(data.pagination.page ?? 1);
    const limit = Number(data.pagination.limit ?? 12);
    const total = Number(data.pagination.total ?? businesses.length);
    const totalPages = Math.max(Number(data.pagination.totalPages ?? 1), 1);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage:
        Boolean(data.pagination.hasNextPage) ||
        (totalPages > 0 ? page < totalPages : false),
      hasPreviousPage:
        Boolean(data.pagination.hasPreviousPage) ||
        (totalPages > 0 ? page > 1 : false),
    };
  }

  return buildDefaultPagination(businesses.length);
}

function normalizePublicBusinessesResponse(
  payload: unknown,
): PublicBusinessesData {
  const data = getDataFromPayload(payload);
  const businesses = getBusinessesFromData(data);
  const pagination = getPaginationFromData(data, businesses);

  return {
    businesses,
    pagination,
  };
}

export const publicBusinessService = {
  async getBusinesses(
    params?: GetPublicBusinessesParams,
  ): Promise<PublicBusinessesData> {
    const response = await api.get<unknown>("/public/businesses", {
      params: cleanParams(params),
    });

    return normalizePublicBusinessesResponse(response.data);
  },
};

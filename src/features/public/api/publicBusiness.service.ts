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

function getEntrepreneursFromData(data: unknown): PublicBusiness[] {
  if (Array.isArray(data)) {
    return data as PublicBusiness[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as PublicBusiness[];
  }

  if (isRecord(data) && Array.isArray(data.entrepreneurs)) {
    return data.entrepreneurs as PublicBusiness[];
  }

  /**
   * Legacy temporal.
   */
  if (isRecord(data) && Array.isArray(data.businesses)) {
    return data.businesses as PublicBusiness[];
  }

  return [];
}

function getPaginationFromData(
  data: unknown,
  entrepreneurs: PublicBusiness[],
): PublicBusinessesPagination {
  if (isRecord(data) && isRecord(data.pagination)) {
    const page = Number(data.pagination.page ?? 1);
    const limit = Number(data.pagination.limit ?? 12);
    const total = Number(data.pagination.total ?? entrepreneurs.length);
    const totalPages = Math.max(Number(data.pagination.totalPages ?? 1), 1);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage:
        Boolean(data.pagination.hasNextPage) ||
        Boolean(data.pagination.hasNext) ||
        (totalPages > 0 ? page < totalPages : false),
      hasPreviousPage:
        Boolean(data.pagination.hasPreviousPage) ||
        Boolean(data.pagination.hasPrevPage) ||
        (totalPages > 0 ? page > 1 : false),
    };
  }

  return buildDefaultPagination(entrepreneurs.length);
}

function normalizePublicEntrepreneursResponse(
  payload: unknown,
): PublicBusinessesData {
  const data = getDataFromPayload(payload);
  const entrepreneurs = getEntrepreneursFromData(data);
  const pagination = getPaginationFromData(data, entrepreneurs);

  return {
    businesses: entrepreneurs,
    pagination,
  };
}

function normalizePublicEntrepreneurDetailResponse(
  payload: unknown,
): PublicBusiness {
  const data = getDataFromPayload(payload);

  if (isRecord(data) && isRecord(data.entrepreneur)) {
    return data.entrepreneur as unknown as PublicBusiness;
  }

  if (isRecord(data) && isRecord(data.business)) {
    return data.business as unknown as PublicBusiness;
  }

  return data as unknown as PublicBusiness;
}

export const publicBusinessService = {
  async getBusinesses(
    params?: GetPublicBusinessesParams,
  ): Promise<PublicBusinessesData> {
    const response = await api.get<unknown>("/public/entrepreneurs", {
      params: cleanParams(params),
    });

    return normalizePublicEntrepreneursResponse(response.data);
  },
  async getBusinessBySlug(slug: string): Promise<PublicBusiness> {
    const response = await api.get<unknown>(`/public/entrepreneurs/${slug}`);

    return normalizePublicEntrepreneurDetailResponse(response.data);
  },
};

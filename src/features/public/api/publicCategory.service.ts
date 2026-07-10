import { api } from "@/lib/axios";

import type {
  GetPublicCategoriesParams,
  PublicCategoriesData,
  PublicCategoriesPagination,
  PublicCategory,
} from "@/features/public/types/publicCategory.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: GetPublicCategoriesParams) {
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
): PublicCategoriesPagination {
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

function getCategoriesFromData(data: unknown): PublicCategory[] {
  if (Array.isArray(data)) {
    return data as PublicCategory[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as PublicCategory[];
  }

  if (isRecord(data) && Array.isArray(data.categories)) {
    return data.categories as PublicCategory[];
  }

  return [];
}

function getPaginationFromData(
  data: unknown,
  categories: PublicCategory[],
): PublicCategoriesPagination {
  if (isRecord(data) && isRecord(data.pagination)) {
    const page = Number(data.pagination.page ?? 1);
    const limit = Number(data.pagination.limit ?? 12);
    const total = Number(data.pagination.total ?? categories.length);
    const totalPages = Math.max(Number(data.pagination.totalPages ?? 1), 1);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage:
        Boolean(data.pagination.hasNextPage) ||
        Boolean(data.pagination.hasNext) ||
        page < totalPages,
      hasPreviousPage:
        Boolean(data.pagination.hasPreviousPage) ||
        Boolean(data.pagination.hasPrevPage) ||
        page > 1,
    };
  }

  return buildDefaultPagination(categories.length);
}

function normalizePublicCategoriesResponse(payload: unknown): PublicCategoriesData {
  const data = getDataFromPayload(payload);
  const categories = getCategoriesFromData(data);
  const pagination = getPaginationFromData(data, categories);

  return {
    categories,
    pagination,
  };
}

export const publicCategoryService = {
  async getCategories(
    params?: GetPublicCategoriesParams,
  ): Promise<PublicCategoriesData> {
    const response = await api.get<unknown>("/categories", {
      params: cleanParams(params),
    });

    return normalizePublicCategoriesResponse(response.data);
  },
};

import { api } from "@/lib/axios";

import type {
  GetPublicCategoriesParams,
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

function getDataFromPayload(payload: unknown) {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function normalizeCategoryList(payload: unknown): PublicCategory[] {
  const data = getDataFromPayload(payload);

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

export const publicCategoryService = {
  async getCategories(
    params?: GetPublicCategoriesParams,
  ): Promise<PublicCategory[]> {
    const response = await api.get<unknown>("/categories", {
      params: cleanParams(params),
    });

    return normalizeCategoryList(response.data);
  },
};

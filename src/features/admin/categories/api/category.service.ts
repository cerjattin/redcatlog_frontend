import { api } from "@/lib/axios";

import type {
  Category,
  CategoryFilters,
  CreateCategoryRequest,
  UpdateCategoryStatusRequest,
} from "@/features/admin/categories/types/category.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: CategoryFilters) {
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

function normalizeCategoryList(payload: unknown): Category[] {
  const data = getDataFromPayload(payload);

  if (Array.isArray(data)) {
    return data as Category[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as Category[];
  }

  if (isRecord(data) && Array.isArray(data.categories)) {
    return data.categories as Category[];
  }

  return [];
}

function normalizeCategory(payload: unknown): Category {
  const data = getDataFromPayload(payload);

  if (isRecord(data) && isRecord(data.category)) {
    return data.category as Category;
  }

  return data as Category;
}

export const categoryService = {
  async listCategories(params?: CategoryFilters): Promise<Category[]> {
    const response = await api.get<unknown>("/categories", {
      params: cleanParams(params),
    });

    return normalizeCategoryList(response.data);
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<unknown>(`/categories/${id}`);

    return normalizeCategory(response.data);
  },

  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<unknown>("/categories", payload);

    return normalizeCategory(response.data);
  },

  async updateCategory(
    id: string,
    payload: Partial<CreateCategoryRequest>,
  ): Promise<Category> {
    const response = await api.put<unknown>(`/categories/${id}`, payload);

    return normalizeCategory(response.data);
  },

  async updateCategoryStatus(
    id: string,
    payload: UpdateCategoryStatusRequest,
  ): Promise<Category> {
    const response = await api.patch<unknown>(
      `/categories/${id}/status`,
      payload,
    );

    return normalizeCategory(response.data);
  },
};

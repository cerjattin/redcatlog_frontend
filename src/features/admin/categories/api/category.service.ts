import { api } from "@/lib/axios";

import type {
  Category,
  CategoryFilters,
  CreateCategoryRequest,
  UpdateCategoryStatusRequest,
} from "@/features/admin/categories/types/category.types";

type CategoryListEnvelope = {
  success: boolean;
  message: string;
  data: Category[];
};

type CategoryEnvelope = {
  success: boolean;
  message: string;
  data: Category;
};

function buildQueryParams(filters: CategoryFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const categoryService = {
  async listCategories(filters: CategoryFilters = {}): Promise<Category[]> {
    const query = buildQueryParams(filters);

    const { data } = await api.get<CategoryListEnvelope>(
      query ? `/categories?${query}` : "/categories",
    );

    return data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const { data } = await api.get<CategoryEnvelope>(`/categories/${id}`);

    return data.data;
  },

  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const { data } = await api.post<CategoryEnvelope>("/categories", payload);

    return data.data;
  },

  async updateCategory(
    id: string,
    payload: Partial<CreateCategoryRequest>,
  ): Promise<Category> {
    const { data } = await api.put<CategoryEnvelope>(
      `/categories/${id}`,
      payload,
    );

    return data.data;
  },

  async updateCategoryStatus(
    id: string,
    payload: UpdateCategoryStatusRequest,
  ): Promise<Category> {
    const { data } = await api.patch<CategoryEnvelope>(
      `/categories/${id}/status`,
      payload,
    );

    return data.data;
  },
};

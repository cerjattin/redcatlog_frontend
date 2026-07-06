import { api } from "@/lib/axios";

import type {
  GetPublicProductsParams,
  PublicProduct,
  PublicProductsData,
  PublicProductsPagination,
} from "@/features/public/types/publicProduct.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function cleanParams(params?: GetPublicProductsParams) {
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
): PublicProductsPagination {
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

function getProductsFromData(data: unknown): PublicProduct[] {
  if (Array.isArray(data)) {
    return data as PublicProduct[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as PublicProduct[];
  }

  if (isRecord(data) && Array.isArray(data.products)) {
    return data.products as PublicProduct[];
  }

  return [];
}

function getPaginationFromData(
  data: unknown,
  products: PublicProduct[],
): PublicProductsPagination {
  if (isRecord(data) && isRecord(data.pagination)) {
    const page = Number(data.pagination.page ?? 1);
    const limit = Number(data.pagination.limit ?? 12);
    const total = Number(data.pagination.total ?? products.length);
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

  return buildDefaultPagination(products.length);
}

function normalizePublicProductsResponse(payload: unknown): PublicProductsData {
  const data = getDataFromPayload(payload);
  const products = getProductsFromData(data);
  const pagination = getPaginationFromData(data, products);

  return {
    products,
    pagination,
  };
}

function normalizePublicProductDetailResponse(payload: unknown): PublicProduct {
  const data = getDataFromPayload(payload);

  if (isRecord(data) && isRecord(data.product)) {
    return data.product as unknown as PublicProduct;
  }

  return data as unknown as PublicProduct;
}

export const publicProductService = {
  async getProducts(
    params?: GetPublicProductsParams,
  ): Promise<PublicProductsData> {
    const response = await api.get<unknown>("/public/products", {
      params: cleanParams(params),
    });

    return normalizePublicProductsResponse(response.data);
  },

  async getProductBySlug(slug: string): Promise<PublicProduct> {
    const response = await api.get<unknown>(`/public/products/${slug}`);

    return normalizePublicProductDetailResponse(response.data);
  },
};

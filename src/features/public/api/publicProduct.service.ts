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

function getResponseData(payload: unknown) {
  if (isRecord(payload) && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function getProductsFromData(data: unknown): PublicProduct[] {
  if (Array.isArray(data)) {
    return data as PublicProduct[];
  }

  if (isRecord(data) && Array.isArray(data.products)) {
    return data.products as PublicProduct[];
  }

  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items as PublicProduct[];
  }

  return [];
}

function getPaginationFromData(
  data: unknown,
  products: PublicProduct[],
): PublicProductsPagination {
  if (isRecord(data) && isRecord(data.pagination)) {
    return data.pagination as unknown as PublicProductsPagination;
  }

  return buildDefaultPagination(products.length);
}

function normalizeProductsResponse(payload: unknown): PublicProductsData {
  const data = getResponseData(payload);
  const products = getProductsFromData(data);
  const pagination = getPaginationFromData(data, products);

  return {
    products,
    pagination,
  };
}

function normalizeProductDetailResponse(payload: unknown): PublicProduct {
  const data = getResponseData(payload);

  if (isRecord(data) && isRecord(data.product)) {
    return data.product as unknown as PublicProduct;
  }

  if (isRecord(data) && "id" in data) {
    return data as unknown as PublicProduct;
  }

  throw new Error("La respuesta del producto no tiene el formato esperado.");
}

export const publicProductService = {
  async getProducts(
    params?: GetPublicProductsParams,
  ): Promise<PublicProductsData> {
    const response = await api.get<unknown>("/public/products", {
      params: cleanParams(params),
    });

    return normalizeProductsResponse(response.data);
  },

  async getProductBySlug(slug: string): Promise<PublicProduct> {
    const response = await api.get<unknown>(`/public/products/${slug}`);

    return normalizeProductDetailResponse(response.data);
  },
};

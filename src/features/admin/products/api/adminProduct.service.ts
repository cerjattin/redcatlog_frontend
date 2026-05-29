import { api } from "@/lib/axios";
import type {
  AdminProductListQuery,
  AdminProductListResponse,
  RejectProductRequest,
  UpdateProductStatusRequest,
} from "@/features/admin/products/types/adminProduct.types";
import type { ProductSummary } from "@/features/products/types/product.types";

type AdminProductListEnvelope = {
  success: boolean;
  message: string;
  data: AdminProductListResponse;
};

type AdminProductEnvelope = {
  success: boolean;
  message: string;
  data: ProductSummary;
};

function buildQueryParams(query: AdminProductListQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export const adminProductService = {
  async listProducts(
    query: AdminProductListQuery = {},
  ): Promise<AdminProductListResponse> {
    const queryString = buildQueryParams(query);

    const { data } = await api.get<AdminProductListEnvelope>(
      queryString ? `/products?${queryString}` : "/products",
    );

    return data.data;
  },

  async getProductById(id: string): Promise<ProductSummary> {
    const { data } = await api.get<AdminProductEnvelope>(`/products/${id}`);

    return data.data;
  },

  async approveProduct(id: string): Promise<ProductSummary> {
    const { data } = await api.patch<AdminProductEnvelope>(
      `/products/${id}/approve`,
    );

    return data.data;
  },

  async rejectProduct(
    id: string,
    payload: RejectProductRequest,
  ): Promise<ProductSummary> {
    const { data } = await api.patch<AdminProductEnvelope>(
      `/products/${id}/reject`,
      payload,
    );

    return data.data;
  },

  async updateProductStatus(
    id: string,
    payload: UpdateProductStatusRequest,
  ): Promise<ProductSummary> {
    const { data } = await api.patch<AdminProductEnvelope>(
      `/products/${id}/status`,
      payload,
    );

    return data.data;
  },
};

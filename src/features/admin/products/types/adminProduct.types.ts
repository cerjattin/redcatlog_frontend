import type {
  ProductSummary,
  ProductStatus,
} from "@/features/products/types/product.types";

export type AdminProductListQuery = {
  page?: number;
  limit?: number;
  status?: ProductStatus | string;
  businessId?: string;
  categoryId?: string;
  search?: string;
};

export type AdminProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminProductListResponse = {
  items: ProductSummary[];
  pagination: AdminProductPagination;
};

export type RejectProductRequest = {
  rejectionReason: string;
};

export type UpdateProductStatusRequest = {
  status: ProductStatus;
};

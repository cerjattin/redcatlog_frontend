import type {
  ProductStatus,
  ProductSummary,
} from "@/features/products/types/product.types";

export type AdminProductListQuery = {
  page?: number;
  limit?: number;
  status?: ProductStatus | string;
  entrepreneurId?: string;
  categoryId?: string;
  search?: string;
  isFeatured?: "true" | "false";
};

export type AdminProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
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

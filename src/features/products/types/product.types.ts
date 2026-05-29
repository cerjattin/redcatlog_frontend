export type ProductStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "published"
  | "rejected"
  | "inactive"
  | "archived";

export type ProductImage = {
  id: string;
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number | null;
  isMain?: boolean;
};

export type ProductSummary = {
  id: string;
  businessId: string;
  categoryId?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | null;
  hasPrice?: boolean;
  stock?: number | null;
  managesStock?: boolean;
  status: ProductStatus;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
  business?: {
    id: string;
    name: string;
    slug: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  images?: ProductImage[];
};

export type CreateProductRequest = {
  businessId: string;
  categoryId?: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: number | null;
  hasPrice?: boolean;
  stock?: number | null;
  managesStock?: boolean;
};

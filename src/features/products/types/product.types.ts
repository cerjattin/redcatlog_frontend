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
  productId?: string | null;
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number | null;
  isMain?: boolean;
};

export type ProductEntrepreneurSummary = {
  id: string;
  userId?: string | null;
  categoryId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  slug?: string | null;
  photoUrl?: string | null;
  bannerUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;
  city?: string | null;
  department?: string | null;
  country?: string | null;
  status?: string | null;
};

export type ProductCategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSummary = {
  id: string;
  entrepreneurId: string;
  categoryId?: string | null;

  name: string;
  slug: string;

  shortDescription?: string | null;
  description?: string | null;

  price?: string | number | null;
  hasPrice?: boolean;

  stock?: number | null;
  managesStock?: boolean;

  status: ProductStatus;
  isFeatured?: boolean;
  featuredOrder?: number | null;

  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  publishedAt?: string | null;

  entrepreneur?: ProductEntrepreneurSummary | null;
  category?: ProductCategorySummary | null;
  images?: ProductImage[];

  createdAt?: string;
  updatedAt?: string;
};

export type CreateProductRequest = {
  entrepreneurId: string;
  categoryId?: string | null;

  name: string;
  slug: string;

  shortDescription?: string | null;
  description?: string | null;

  price?: number | string | null;
  hasPrice?: boolean;

  stock?: number | string | null;
  managesStock?: boolean;
};

export type UpdateProductRequest = Partial<CreateProductRequest> & {
  status?: ProductStatus;
  isFeatured?: boolean;
  featuredOrder?: number | string | null;
};

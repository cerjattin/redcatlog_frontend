export type BusinessStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "published"
  | "rejected"
  | "inactive"
  | "archived";

export type AdminBusiness = {
  id: string;
  entrepreneurId: string;
  mainCategoryId: string | null;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  story: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  city: string | null;
  department: string | null;
  country: string | null;
  addressText: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  status: BusinessStatus;
  isFeatured: boolean;
  featuredOrder: number | null;
  publishedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  mainCategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
  entrepreneur: {
    id: string;
    status: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  } | null;
  productsCount: number;
  socialLinks: unknown[];
};

export type AdminBusinessListQuery = {
  page?: number;
  limit?: number;
  status?: BusinessStatus | string;
  city?: string;
  department?: string;
  categoryId?: string;
  search?: string;
};

export type AdminBusinessPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminBusinessListResponse = {
  items: AdminBusiness[];
  pagination: AdminBusinessPagination;
};

export type RejectBusinessRequest = {
  rejectionReason: string;
};

export type UpdateBusinessStatusRequest = {
  status: BusinessStatus;
};

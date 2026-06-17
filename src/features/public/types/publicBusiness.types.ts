export interface PublicBusinessCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicBusinessEntrepreneur {
  id: string;
  fullName?: string | null;
  city?: string | null;
  department?: string | null;
  profilePhotoUrl?: string | null;
}

export interface PublicBusinessProductSummary {
  id: string;
  name: string;
  slug: string;
  mainImageUrl?: string | null;
}

export interface PublicBusiness {
  id: string;
  entrepreneurId?: string | null;
  mainCategoryId?: string | null;

  name: string;
  slug: string;
  status?: string | null;

  shortDescription?: string | null;
  description?: string | null;
  story?: string | null;

  logoUrl?: string | null;
  bannerUrl?: string | null;
  coverImageUrl?: string | null;

  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;
  addressText?: string | null;

  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;

  city?: string | null;
  department?: string | null;
  country?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;

  category?: PublicBusinessCategory | null;
  mainCategory?: PublicBusinessCategory | null;
  entrepreneur?: PublicBusinessEntrepreneur | null;

  productsCount?: number | null;
  productCount?: number | null;
  products?: PublicBusinessProductSummary[];

  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PublicBusinessesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PublicBusinessesData {
  businesses: PublicBusiness[];
  pagination: PublicBusinessesPagination;
}

export interface GetPublicBusinessesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean;
}

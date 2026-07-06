export interface PublicEntrepreneurCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicEntrepreneurProductSummary {
  id: string;
  name: string;
  slug: string;
  mainImageUrl?: string | null;
}

export interface PublicEntrepreneur {
  id: string;
  userId?: string | null;
  categoryId?: string | null;

  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  slug?: string | null;

  shortBio?: string | null;
  bio?: string | null;
  personalStory?: string | null;
  description?: string | null;

  photoUrl?: string | null;
  profilePhotoUrl?: string | null;
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
  locationText?: string | null;

  status?: string | null;
  isFeatured?: boolean | null;
  featuredOrder?: number | null;

  category?: PublicEntrepreneurCategory | null;

  productsCount?: number | null;
  productCount?: number | null;
  products?: PublicEntrepreneurProductSummary[];

  createdAt?: string | null;
  updatedAt?: string | null;
}

/**
 * Alias temporales para no romper imports actuales.
 * En una fase posterior podemos renombrar archivos a publicEntrepreneur.*
 */
export type PublicBusiness = PublicEntrepreneur;
export type PublicBusinessCategory = PublicEntrepreneurCategory;
export type PublicBusinessProductSummary = PublicEntrepreneurProductSummary;

export interface PublicBusinessesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PublicBusinessesData {
  businesses: PublicEntrepreneur[];
  pagination: PublicBusinessesPagination;
}

export interface GetPublicBusinessesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  featured?: boolean;
}

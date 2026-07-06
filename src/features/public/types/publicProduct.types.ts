export interface PublicProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  isMain: boolean;
}

export interface PublicProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicProductEntrepreneur {
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
}

/**
 * Legacy temporal.
 * Se mantiene solo para que archivos pendientes de refactor no rompan build.
 */
export interface PublicProductLegacyBusiness {
  id: string;
  name: string;
  slug: string;
  contactWhatsapp?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;
}

export interface PublicProduct {
  id: string;
  entrepreneurId: string;
  categoryId: string | null;

  /**
   * Legacy temporal.
   */
  businessId?: string | null;

  name: string;
  slug: string;

  shortDescription?: string | null;
  description?: string | null;

  price?: string | number | null;
  hasPrice: boolean;

  managesStock: boolean;
  stock?: number | null;

  status: "published";
  isFeatured: boolean;

  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  category?: PublicProductCategory | null;
  entrepreneur?: PublicProductEntrepreneur | null;

  /**
   * Legacy temporal.
   */
  business?: PublicProductLegacyBusiness | null;

  images: PublicProductImage[];
  mainImageUrl?: string | null;
}

export interface PublicProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PublicProductsData {
  products: PublicProduct[];
  pagination: PublicProductsPagination;
}

export interface PublicProductsResponse {
  success: boolean;
  message: string;
  data: {
    products?: PublicProduct[];
    items?: PublicProduct[];
    pagination: PublicProductsPagination;
  };
}

export interface PublicProductDetailResponse {
  success: boolean;
  message: string;
  data: {
    product: PublicProduct;
  };
}

export interface GetPublicProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  entrepreneurId?: string;
  featured?: boolean;
}

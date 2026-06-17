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

export interface PublicProductBusiness {
  id: string;
  name: string;
  slug: string;
  description?: string | null;

  // Campos nuevos del backend de emprendimientos
  contactWhatsapp?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  addressText?: string | null;

  // Compatibilidad con respuestas públicas anteriores
  whatsapp?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;

  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;
}

export interface PublicProductEntrepreneur {
  id: string;
  fullName: string;
  bio?: string | null;
  city?: string | null;
  department?: string | null;
  profilePhotoUrl?: string | null;
}

export interface PublicProduct {
  id: string;
  businessId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price?: string | null;
  hasPrice: boolean;
  managesStock: boolean;
  stock?: number | null;
  status: "published";
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  category?: PublicProductCategory | null;
  business?: PublicProductBusiness | null;
  entrepreneur?: PublicProductEntrepreneur | null;
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
  businessId?: string;
  entrepreneurId?: string;
  featured?: boolean;
}

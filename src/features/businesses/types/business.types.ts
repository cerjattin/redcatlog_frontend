export type BusinessStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "published"
  | "rejected"
  | "inactive"
  | "archived";

export type BusinessSummary = {
  id: string;
  entrepreneurId?: string | null;
  mainCategoryId?: string | null;

  name: string;
  slug: string;
  status: BusinessStatus;

  shortDescription?: string | null;
  description?: string | null;
  story?: string | null;

  logoUrl?: string | null;
  bannerUrl?: string | null;

  // Compatibilidad temporal si alguna respuesta antigua trae coverImageUrl
  coverImageUrl?: string | null;

  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;

  // Compatibilidad temporal con campos antiguos usados por algunas vistas
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;

  city?: string | null;
  department?: string | null;
  country?: string | null;
  addressText?: string | null;
  address?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type BusinessDetail = BusinessSummary & {
  rejectionReason?: string | null;
};

export type CreateBusinessRequest = {
  mainCategoryId?: string | null;
  name: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  story?: string | null;

  logoUrl?: string | null;
  bannerUrl?: string | null;

  contactEmail?: string | null;
  contactPhone?: string | null;
  contactWhatsapp?: string | null;

  city?: string | null;
  department?: string | null;
  country?: string | null;
  addressText?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;
};

export type UpdateBusinessRequest = Partial<CreateBusinessRequest>;

export type UploadBusinessImageResponse = {
  fileUrl: string;
  mediaFileId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
};

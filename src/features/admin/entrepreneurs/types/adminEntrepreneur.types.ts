export type EntrepreneurStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "inactive"
  | "active";

export type AdminEntrepreneurUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  city: string | null;
  department: string | null;
  status: string;
  role: {
    id: string;
    name: string;
  } | null;
};

export type AdminEntrepreneurCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AdminEntrepreneur = {
  id: string;
  userId?: string | null;
  categoryId?: string | null;

  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  slug?: string | null;

  documentType?: string | null;
  documentNumber?: string | null;

  personalStory?: string | null;
  shortBio?: string | null;
  bio?: string | null;
  locationText?: string | null;

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

  status: EntrepreneurStatus;

  approvedAt?: string | null;
  approvedBy?: string | null;
  rejectedAt?: string | null;
  rejectionReason?: string | null;

  createdAt?: string;
  updatedAt?: string;

  user?: AdminEntrepreneurUser | null;
  category?: AdminEntrepreneurCategory | null;
};

export type AdminEntrepreneurListQuery = {
  page?: number;
  limit?: number;
  status?: EntrepreneurStatus | string;
  city?: string;
  department?: string;
  categoryId?: string;
  search?: string;
};

export type AdminEntrepreneurPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type AdminEntrepreneurListResponse = {
  items: AdminEntrepreneur[];
  pagination: AdminEntrepreneurPagination;
};

export type CreateEntrepreneurRequest = {
  categoryId?: string | null;

  firstName: string;
  lastName: string;
  fullName?: string | null;
  slug: string;

  documentType?: string | null;
  documentNumber?: string | null;

  shortBio?: string | null;
  bio?: string | null;
  personalStory?: string | null;
  locationText?: string | null;

  photoUrl?: string | null;
  bannerUrl?: string | null;

  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;

  city?: string | null;
  department?: string | null;
  country?: string | null;

  facebookUrl?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  youtubeUrl?: string | null;
  websiteUrl?: string | null;

  status?: EntrepreneurStatus;
};

export type UpdateEntrepreneurRequest = Partial<CreateEntrepreneurRequest>;

export type RejectEntrepreneurRequest = {
  rejectionReason: string;
};

export type UpdateEntrepreneurStatusRequest = {
  status: EntrepreneurStatus;
};

export type UploadEntrepreneurImageResponse = {
  fileUrl: string;
  mediaFileId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  folder: string;
};

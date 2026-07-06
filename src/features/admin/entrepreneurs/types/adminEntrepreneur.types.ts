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

  /**
   * Legacy temporal.
   * Se mantiene solo para no romper páginas antiguas mientras eliminamos businesses.
   */
  businesses?: {
    id: string;
    name: string;
    slug: string;
    status: string;
  }[];
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

export type RejectEntrepreneurRequest = {
  rejectionReason: string;
};

export type UpdateEntrepreneurStatusRequest = {
  status: EntrepreneurStatus;
};

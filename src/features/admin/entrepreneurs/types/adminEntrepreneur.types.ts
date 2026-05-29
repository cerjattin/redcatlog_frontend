export type EntrepreneurStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "inactive";

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

export type AdminEntrepreneurBusinessSummary = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type AdminEntrepreneur = {
  id: string;
  userId: string;

  documentType: string | null;
  documentNumber: string | null;

  personalStory: string | null;
  shortBio: string | null;
  locationText: string | null;

  city: string | null;
  department: string | null;
  country: string | null;

  status: EntrepreneurStatus;

  approvedAt: string | null;
  approvedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;

  createdAt: string;
  updatedAt: string;

  user: AdminEntrepreneurUser | null;
  businesses: AdminEntrepreneurBusinessSummary[];
};

export type AdminEntrepreneurListQuery = {
  page?: number;
  limit?: number;
  status?: EntrepreneurStatus | string;
  city?: string;
  department?: string;
  search?: string;
};

export type AdminEntrepreneurPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
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

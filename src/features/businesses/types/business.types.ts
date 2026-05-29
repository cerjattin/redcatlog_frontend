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
  name: string;
  slug: string;
  status: BusinessStatus;
  description?: string | null;
  shortDescription?: string | null;
  city?: string | null;
  department?: string | null;
  country?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BusinessDetail = BusinessSummary & {
  email?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  rejectionReason?: string | null;
};

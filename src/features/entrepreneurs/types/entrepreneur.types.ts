export type EntrepreneurStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "inactive";

export type EntrepreneurProfileUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  department?: string | null;
  status?: string | null;
};

export type EntrepreneurBusinessSummary = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type EntrepreneurProfile = {
  id: string;
  userId: string;
  documentType?: string | null;
  documentNumber?: string | null;
  personalStory?: string | null;
  shortBio?: string | null;
  locationText?: string | null;
  city?: string | null;
  department?: string | null;
  country?: string | null;
  status: EntrepreneurStatus;
  user?: EntrepreneurProfileUser | null;
  businesses?: EntrepreneurBusinessSummary[];
};

export type CreateEntrepreneurProfileRequest = {
  documentType?: string;
  documentNumber?: string;
  personalStory?: string;
  shortBio?: string;
  locationText?: string;
  city?: string;
  department?: string;
  country?: string;
};

export type UpdateEntrepreneurProfileRequest = CreateEntrepreneurProfileRequest;

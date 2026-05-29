export type UserRole =
  | "admin"
  | "super_admin"
  | "entrepreneur"
  | "emprendedora"
  | "visitor";

export type UserStatus = "active" | "inactive" | "pending" | "rejected";

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string | null;
  whatsapp?: string | null;
  city?: string | null;
  department?: string | null;
  country?: string | null;
  profilePhotoUrl?: string | null;
  bio?: string | null;
  forcePasswordChange?: boolean;
  passwordChangedAt?: string | null;
};

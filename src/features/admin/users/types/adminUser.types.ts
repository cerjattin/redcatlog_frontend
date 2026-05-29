export type UserStatus =
  | "pending"
  | "active"
  | "inactive"
  | "blocked"
  | "deleted";

export type AdminUserRole = {
  id: string;
  name: string;
  description: string | null;
};

export type AdminUserEntrepreneur = {
  id: string;
  status: string;
};

export type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  phone: string | null;
  whatsapp: string | null;
  profilePhotoUrl: string | null;
  bio: string | null;

  city: string | null;
  department: string | null;
  country: string | null;

  status: UserStatus;

  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;

  role: AdminUserRole | null;
  entrepreneur: AdminUserEntrepreneur | null;
};

export type AdminUsersListQuery = {
  page?: number;
  limit?: number;
  status?: UserStatus | string;
  role?: string;
  search?: string;
};

export type AdminUsersPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminUsersListResponse = {
  items: AdminUser[];
  pagination: AdminUsersPagination;
};

export type UpdateUserStatusPayload = {
  status: UserStatus;
};

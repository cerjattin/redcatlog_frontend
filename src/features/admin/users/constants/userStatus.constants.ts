import type { UserStatus } from "@/features/admin/users/types/adminUser.types";

export const USER_STATUS_OPTIONS: Array<{
  value: UserStatus;
  label: string;
}> = [
  { value: "pending", label: "Pendiente" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "blocked", label: "Bloqueado" },
  { value: "deleted", label: "Eliminado" },
];

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  pending: "Pendiente",
  active: "Activo",
  inactive: "Inactivo",
  blocked: "Bloqueado",
  deleted: "Eliminado",
};

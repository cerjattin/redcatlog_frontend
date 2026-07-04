import type { UserRole } from "@/types/user.types";

export function isAdminRole(role?: string | null): boolean {
  return role === "admin";
}

export function isEditorRole(role?: string | null): boolean {
  return role === "editor";
}

export function canManageContentRole(role?: string | null): boolean {
  return role === "admin" || role === "editor";
}

export function getDefaultPrivateRouteByRole(
  role?: UserRole | string | null,
): string {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "editor") {
    return "/editor";
  }

  return "/login";
}

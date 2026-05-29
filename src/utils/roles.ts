import type { UserRole } from "@/types/user.types";

export function isAdminRole(role?: string | null): boolean {
  return role === "admin" || role === "super_admin";
}

export function isEntrepreneurRole(role?: string | null): boolean {
  return role === "entrepreneur" || role === "emprendedora";
}

export function getDefaultPrivateRouteByRole(role?: UserRole | string | null): string {
  if (isAdminRole(role)) {
    return "/admin";
  }

  if (isEntrepreneurRole(role)) {
    return "/dashboard";
  }

  return "/login";
}
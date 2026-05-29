import type { AuthUser } from "@/types/user.types";

export const mockAdminUser: AuthUser = {
  id: "1",
  firstName: "Admin",
  lastName: "Red Mujeres",
  email: "admin@redmujeres.local",
  role: "admin",
  status: "active",
  phone: null,
  whatsapp: null,
  city: "Barranquilla",
  department: "Atlántico",
};

export const mockEntrepreneurUser: AuthUser = {
  id: "2",
  firstName: "Emprendedora",
  lastName: "Demo",
  email: "emprendedora@redmujeres.local",
  role: "entrepreneur",
  status: "active",
  phone: null,
  whatsapp: null,
  city: "Barranquilla",
  department: "Atlántico",
};

export const mockCurrentUser: AuthUser | null = mockAdminUser; // Cambia a mockEntrepreneurUser o null para probar diferentes escenarios

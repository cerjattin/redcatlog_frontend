import type { BusinessStatus } from "@/features/admin/businesses/types/adminBusiness.types";

export const BUSINESS_STATUS_OPTIONS: Array<{
  value: BusinessStatus;
  label: string;
}> = [
  { value: "draft", label: "Borrador" },
  { value: "pending_review", label: "Pendiente de revisión" },
  { value: "approved", label: "Aprobado" },
  { value: "published", label: "Publicado" },
  { value: "rejected", label: "Rechazado" },
  { value: "inactive", label: "Inactivo" },
  { value: "archived", label: "Archivado" },
];

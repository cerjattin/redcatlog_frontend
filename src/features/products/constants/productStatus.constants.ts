import type { ProductStatus } from "@/features/products/types/product.types";

export const PRODUCT_STATUS_OPTIONS: Array<{
  value: ProductStatus;
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

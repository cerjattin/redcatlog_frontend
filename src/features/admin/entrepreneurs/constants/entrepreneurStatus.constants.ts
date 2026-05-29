import type { EntrepreneurStatus } from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";

export const ENTREPRENEUR_STATUS_OPTIONS: Array<{
  value: EntrepreneurStatus;
  label: string;
}> = [
  { value: "draft", label: "Borrador" },
  { value: "pending_review", label: "Pendiente de revisión" },
  { value: "approved", label: "Aprobada" },
  { value: "rejected", label: "Rechazada" },
  { value: "inactive", label: "Inactiva" },
];

export const ENTREPRENEUR_STATUS_LABELS: Record<EntrepreneurStatus, string> = {
  draft: "Borrador",
  pending_review: "Pendiente de revisión",
  approved: "Aprobada",
  rejected: "Rechazada",
  inactive: "Inactiva",
};

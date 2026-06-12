import { ArrowLeft, Check, ImageOff, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminBusinessService } from "@/features/admin/businesses/api/adminBusiness.service";
import { BUSINESS_STATUS_OPTIONS } from "@/features/admin/businesses/constants/businessStatus.constants";
import type {
  AdminBusiness,
  BusinessStatus,
} from "@/features/admin/businesses/types/adminBusiness.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente",
    approved: "Aprobado",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
    archived: "Archivado",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "approved" || status === "published") {
    return "success";
  }

  if (status === "pending_review") {
    return "warning";
  }

  if (status === "rejected" || status === "inactive" || status === "archived") {
    return "danger";
  }

  return "neutral";
}

export function AdminBusinessDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [business, setBusiness] = useState<AdminBusiness | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<BusinessStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBusiness = useCallback(async () => {
    if (!params.id) {
      setError("No se encontró el identificador del emprendimiento.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await adminBusinessService.getBusinessById(params.id);

      setBusiness(data);
      setSelectedStatus(data.status);
    } catch {
      setError("No fue posible cargar el emprendimiento.");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  async function handleApprove() {
    if (!business) {
      return;
    }

    try {
      setActionLoading(true);

      await adminBusinessService.approveBusiness(business.id);

      await loadBusiness();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!business) {
      return;
    }

    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoading(true);

      await adminBusinessService.rejectBusiness(business.id, {
        rejectionReason: reason.trim(),
      });

      await loadBusiness();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleStatusChange() {
    if (!business || !selectedStatus) {
      return;
    }

    try {
      setActionLoading(true);

      await adminBusinessService.updateBusinessStatus(business.id, {
        status: selectedStatus,
      });

      await loadBusiness();
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando emprendimiento..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar el emprendimiento"
        description={error}
      />
    );
  }

  if (!business) {
    return (
      <EmptyState
        title="Emprendimiento no encontrado"
        description="No encontramos información para este emprendimiento."
      />
    );
  }

  const entrepreneurUser = business.entrepreneur?.user;

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title={business.name}
        description={
          business.shortDescription ??
          "Detalle administrativo del emprendimiento."
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(paths.admin.businesses)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button disabled={actionLoading} onClick={handleApprove}>
              <Check className="mr-2 h-4 w-4" />
              Aprobar
            </Button>

            <Button
              variant="danger"
              disabled={actionLoading}
              onClick={handleReject}
            >
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Información general
              </h2>

              <p className="mt-1 text-xs text-ink-500">/{business.slug}</p>
            </div>

            <Badge variant={getStatusVariant(business.status)}>
              {getStatusLabel(business.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Categoría principal
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.mainCategory?.name ?? "Sin categoría"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Productos
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {business.productsCount}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.city ?? "No registrada"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.department ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                País
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.country ?? "Colombia"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Dirección
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.addressText ?? "No registrada"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Descripción</h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {business.description ?? "Sin descripción registrada."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Historia</h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {business.story ?? "Sin historia registrada."}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-ink-900">Contenido visual</h2>

            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
                {business.bannerUrl ? (
                  <img
                    src={buildImageUrl(business.bannerUrl) ?? ""}
                    alt={`Banner de ${business.name}`}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center text-sm text-ink-400">
                    <ImageOff className="h-7 w-7" />
                    <span className="mt-2">Sin banner</span>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
                {business.logoUrl ? (
                  <img
                    src={buildImageUrl(business.logoUrl) ?? ""}
                    alt={`Logo de ${business.name}`}
                    className="h-28 w-full object-contain p-4"
                  />
                ) : (
                  <div className="flex h-28 flex-col items-center justify-center text-sm text-ink-400">
                    <ImageOff className="h-7 w-7" />
                    <span className="mt-2">Sin logo</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Emprendedora</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Nombre
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {entrepreneurUser
                    ? `${entrepreneurUser.firstName} ${entrepreneurUser.lastName}`
                    : "No registrada"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Correo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {entrepreneurUser?.email ?? "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Estado emprendedora
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {business.entrepreneur?.status ?? "No registrado"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Contacto y redes sociales
        </h2>

        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Email
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.contactEmail ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Teléfono
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.contactPhone ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              WhatsApp
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.contactWhatsapp ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Instagram
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.instagramUrl ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Facebook
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.facebookUrl ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Web
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {business.websiteUrl ?? "No registrado"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Control manual de estado
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-500">
          Usa esta acción solo cuando necesites ajustar manualmente el estado
          del emprendimiento desde administración.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[260px_auto]">
          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as BusinessStatus)
            }
          >
            {BUSINESS_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            disabled={actionLoading || selectedStatus === business.status}
            onClick={handleStatusChange}
          >
            Actualizar estado
          </Button>
        </div>
      </Card>

      {business.rejectionReason ? (
        <Card className="mt-4 border-red-100 bg-red-50">
          <h2 className="text-lg font-bold text-red-800">Motivo de rechazo</h2>

          <p className="mt-3 text-sm leading-7 text-red-700">
            {business.rejectionReason}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

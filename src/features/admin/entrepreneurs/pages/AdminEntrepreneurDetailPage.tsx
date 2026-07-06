import {
  ArrowLeft,
  Check,
  ExternalLink,
  ImageOff,
  Pencil,
  UserX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminEntrepreneurService } from "@/features/admin/entrepreneurs/api/adminEntrepreneur.service";
import { ENTREPRENEUR_STATUS_OPTIONS } from "@/features/admin/entrepreneurs/constants/entrepreneurStatus.constants";
import type {
  AdminEntrepreneur,
  EntrepreneurStatus,
} from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente",
    approved: "Aprobada",
    active: "Activa",
    rejected: "Rechazada",
    inactive: "Inactiva",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "approved" || status === "active") {
    return "success";
  }

  if (status === "pending_review") {
    return "warning";
  }

  if (status === "rejected" || status === "inactive") {
    return "danger";
  }

  return "neutral";
}

function getEntrepreneurName(entrepreneur: AdminEntrepreneur) {
  const fullName = entrepreneur.fullName?.trim();

  if (fullName) {
    return fullName;
  }

  const firstName =
    entrepreneur.firstName?.trim() ??
    entrepreneur.user?.firstName?.trim() ??
    "";

  const lastName =
    entrepreneur.lastName?.trim() ?? entrepreneur.user?.lastName?.trim() ?? "";

  const name = `${firstName} ${lastName}`.trim();

  return name || `Emprendedora #${entrepreneur.id}`;
}

function getEditEntrepreneurPath(id: string) {
  return paths.admin.editEntrepreneur.replace(":id", id);
}

function getEmail(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.email ?? entrepreneur.user?.email ?? null;
}

function getPhone(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.phone ?? entrepreneur.user?.phone ?? null;
}

function getWhatsapp(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.whatsapp ?? entrepreneur.user?.whatsapp ?? null;
}

function getCity(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.city ?? entrepreneur.user?.city ?? null;
}

function getDepartment(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.department ?? entrepreneur.user?.department ?? null;
}

function getDisplayValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "No registrado";
  }

  return String(value);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "No registrado";
  }

  return new Date(value).toLocaleString("es-CO");
}

export function AdminEntrepreneurDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [entrepreneur, setEntrepreneur] = useState<AdminEntrepreneur | null>(
    null,
  );
  const [selectedStatus, setSelectedStatus] = useState<EntrepreneurStatus | "">(
    "",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntrepreneur = useCallback(async () => {
    if (!params.id) {
      setError("No se encontró el identificador de la emprendedora.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await adminEntrepreneurService.getEntrepreneurById(
        params.id,
      );

      setEntrepreneur(data);
      setSelectedStatus(data.status);
    } catch {
      setError("No fue posible cargar la emprendedora.");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void loadEntrepreneur();
  }, [loadEntrepreneur]);

  async function handleApprove() {
    if (!entrepreneur) {
      return;
    }

    try {
      setActionLoading(true);
      await adminEntrepreneurService.approveEntrepreneur(entrepreneur.id);
      await loadEntrepreneur();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!entrepreneur) {
      return;
    }

    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoading(true);

      await adminEntrepreneurService.rejectEntrepreneur(entrepreneur.id, {
        rejectionReason: reason.trim(),
      });

      await loadEntrepreneur();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleStatusChange() {
    if (!entrepreneur || !selectedStatus) {
      return;
    }

    try {
      setActionLoading(true);

      await adminEntrepreneurService.updateEntrepreneurStatus(entrepreneur.id, {
        status: selectedStatus,
      });

      await loadEntrepreneur();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeactivate() {
    if (!entrepreneur) {
      return;
    }

    try {
      setActionLoading(true);

      await adminEntrepreneurService.updateEntrepreneurStatus(entrepreneur.id, {
        status: "inactive",
      });

      await loadEntrepreneur();
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando emprendedora..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar la emprendedora"
        description={error}
      />
    );
  }

  if (!entrepreneur) {
    return (
      <EmptyState
        title="Emprendedora no encontrada"
        description="No encontramos información para este perfil."
      />
    );
  }

  const photoUrl = buildImageUrl(
    entrepreneur.photoUrl ?? entrepreneur.profilePhotoUrl,
  );
  const bannerUrl = buildImageUrl(entrepreneur.bannerUrl);
  const name = getEntrepreneurName(entrepreneur);

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title={name}
        description={
          entrepreneur.shortBio ??
          entrepreneur.bio ??
          "Detalle administrativo del perfil de emprendedora."
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(paths.admin.entrepreneurs)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(getEditEntrepreneurPath(entrepreneur.id))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
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

            <Button
              variant="secondary"
              disabled={actionLoading || entrepreneur.status === "inactive"}
              onClick={handleDeactivate}
            >
              <UserX className="mr-2 h-4 w-4" />
              Inactivar
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`Banner de ${name}`}
            className="h-52 w-full object-cover md:h-72"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-ink-50 text-ink-400 md:h-72">
            <ImageOff className="h-9 w-9" />
          </div>
        )}

        <div className="flex flex-col gap-5 px-6 pb-6 pt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="h-24 w-24 rounded-2xl border border-ink-100 bg-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-100 bg-ink-50 text-xs text-ink-400">
                Sin foto
              </div>
            )}

            <div>
              <div className="mb-2">
                <Badge variant={getStatusVariant(entrepreneur.status)}>
                  {getStatusLabel(entrepreneur.status)}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-ink-900">{name}</h2>

              <p className="mt-1 text-sm text-ink-500">
                {entrepreneur.category?.name ?? "Sin categoría principal"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Información del perfil
              </h2>

              <p className="mt-1 text-xs text-ink-500">
                ID perfil: {entrepreneur.id}
                {entrepreneur.userId
                  ? ` · Usuario: ${entrepreneur.userId}`
                  : ""}
              </p>
            </div>

            <Badge variant={getStatusVariant(entrepreneur.status)}>
              {getStatusLabel(entrepreneur.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Nombre
              </dt>
              <dd className="mt-1 text-sm text-ink-900">{name}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Slug
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(entrepreneur.slug)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Categoría
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.category?.name ?? "Sin categoría"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Documento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.documentNumber
                  ? `${entrepreneur.documentType ?? "Doc"} ${entrepreneur.documentNumber}`
                  : "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(getCity(entrepreneur))}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(getDepartment(entrepreneur))}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                País
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.country ?? "Colombia"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ubicación textual
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(entrepreneur.locationText)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Biografía corta</h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {entrepreneur.shortBio ??
                entrepreneur.bio ??
                "Sin biografía registrada."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">
              Historia personal
            </h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {entrepreneur.personalStory ?? "Sin historia registrada."}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-ink-900">Contacto</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Correo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(getEmail(entrepreneur))}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Teléfono
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(getPhone(entrepreneur))}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(getWhatsapp(entrepreneur))}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Redes sociales</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {entrepreneur.instagramUrl ? (
                <a
                  href={entrepreneur.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Instagram
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {entrepreneur.facebookUrl ? (
                <a
                  href={entrepreneur.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Facebook
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {entrepreneur.tiktokUrl ? (
                <a
                  href={entrepreneur.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  TikTok
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {entrepreneur.youtubeUrl ? (
                <a
                  href={entrepreneur.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  YouTube
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {entrepreneur.websiteUrl ? (
                <a
                  href={entrepreneur.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Sitio web
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {!entrepreneur.instagramUrl &&
              !entrepreneur.facebookUrl &&
              !entrepreneur.tiktokUrl &&
              !entrepreneur.youtubeUrl &&
              !entrepreneur.websiteUrl ? (
                <p className="text-sm text-ink-500">
                  No hay redes sociales registradas.
                </p>
              ) : null}
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Fechas</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Creación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {formatDate(entrepreneur.createdAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Actualización
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {formatDate(entrepreneur.updatedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Aprobación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {formatDate(entrepreneur.approvedAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Rechazo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {formatDate(entrepreneur.rejectedAt)}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Control manual de estado
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-500">
          Usa esta acción solo cuando necesites ajustar manualmente el estado
          del perfil de emprendedora.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[260px_auto]">
          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as EntrepreneurStatus)
            }
          >
            {ENTREPRENEUR_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            disabled={actionLoading || selectedStatus === entrepreneur.status}
            onClick={handleStatusChange}
          >
            Actualizar estado
          </Button>
        </div>
      </Card>

      {entrepreneur.rejectionReason ? (
        <Card className="mt-4 border-red-100 bg-red-50">
          <h2 className="text-lg font-bold text-red-800">Motivo de rechazo</h2>

          <p className="mt-3 text-sm leading-7 text-red-700">
            {entrepreneur.rejectionReason}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

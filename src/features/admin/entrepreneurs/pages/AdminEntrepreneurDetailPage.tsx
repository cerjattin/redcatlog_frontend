import { ArrowLeft, Check, Store, UserX, X } from "lucide-react";
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

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    inactive: "Inactiva",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "approved") {
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

function getAdminBusinessDetailPath(id: string) {
  return paths.admin.businessDetail.replace(":id", id);
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

  const user = entrepreneur.user;

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title={
          user ? `${user.firstName} ${user.lastName}` : "Perfil de emprendedora"
        }
        description={
          entrepreneur.shortBio ??
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

      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Información del perfil
              </h2>

              <p className="mt-1 text-xs text-ink-500">
                ID perfil: {entrepreneur.id} · Usuario: {entrepreneur.userId}
              </p>
            </div>

            <Badge variant={getStatusVariant(entrepreneur.status)}>
              {getStatusLabel(entrepreneur.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Tipo de documento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.documentType ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Número de documento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.documentNumber ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.city ?? user?.city ?? "No registrada"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {entrepreneur.department ?? user?.department ?? "No registrado"}
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
                {entrepreneur.locationText ?? "No registrada"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Biografía corta</h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {entrepreneur.shortBio ?? "Sin biografía registrada."}
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
            <h2 className="text-lg font-bold text-ink-900">Datos de usuario</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Nombre
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user
                    ? `${user.firstName} ${user.lastName}`
                    : "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Correo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user?.email ?? "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Teléfono
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user?.phone ?? "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user?.whatsapp ?? "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Estado usuario
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user?.status ?? "No registrado"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Rol
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user?.role?.name ?? "No registrado"}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Fechas</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Creación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {new Date(entrepreneur.createdAt).toLocaleString("es-CO")}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Actualización
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {new Date(entrepreneur.updatedAt).toLocaleString("es-CO")}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Aprobación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {entrepreneur.approvedAt
                    ? new Date(entrepreneur.approvedAt).toLocaleString("es-CO")
                    : "No aprobada"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Rechazo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {entrepreneur.rejectedAt
                    ? new Date(entrepreneur.rejectedAt).toLocaleString("es-CO")
                    : "Sin rechazo"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Emprendimientos asociados
        </h2>

        {entrepreneur.businesses.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {entrepreneur.businesses.map((business) => (
              <button
                key={business.id}
                type="button"
                className="rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                onClick={() =>
                  navigate(getAdminBusinessDetailPath(business.id))
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-900">
                      {business.name}
                    </p>

                    <p className="mt-1 text-xs text-ink-500">
                      /{business.slug}
                    </p>
                  </div>

                  <Badge variant={getStatusVariant(business.status)}>
                    {getStatusLabel(business.status)}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-100 bg-ink-50 text-ink-400">
            <Store className="h-7 w-7" />
            <p className="mt-3 text-sm">
              Esta emprendedora aún no tiene emprendimientos asociados.
            </p>
          </div>
        )}
      </Card>

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

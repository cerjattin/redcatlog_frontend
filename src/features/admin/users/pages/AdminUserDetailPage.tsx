import {
  ArrowLeft,
  Ban,
  UserCheck,
  UserRound,
  UserX,
  KeyRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminUserService } from "@/features/admin/users/api/adminUser.service";
import { USER_STATUS_OPTIONS } from "@/features/admin/users/constants/userStatus.constants";
import type {
  AdminUser,
  UserStatus,
} from "@/features/admin/users/types/adminUser.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";
import { AdminResetPasswordModal } from "@/features/admin/users/components/AdminResetPasswordModal";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    active: "Activo",
    inactive: "Inactivo",
    blocked: "Bloqueado",
    deleted: "Eliminado",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "active") {
    return "success";
  }

  if (status === "pending") {
    return "warning";
  }

  if (status === "inactive" || status === "blocked" || status === "deleted") {
    return "danger";
  }

  return "neutral";
}

function getRoleLabel(role?: string | null) {
  const labels: Record<string, string> = {
    admin: "Administrador",
    super_admin: "Super administrador",
    entrepreneur: "Emprendedora",
  };

  return role ? (labels[role] ?? role) : "Sin rol";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Sin registro";
  }

  return new Date(value).toLocaleString("es-CO");
}

function getAdminEntrepreneurDetailPath(id: string) {
  return paths.admin.entrepreneurDetail.replace(":id", id);
}

export function AdminUserDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadUser() {
    if (!params.id) {
      setError("No se encontró el identificador del usuario.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await adminUserService.getUserById(params.id);

      setUser(data);
      setSelectedStatus(data.status);
    } catch {
      setError("No fue posible cargar el usuario.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUser();
  }, [params.id]);

  async function handleStatusChange(status: UserStatus) {
    if (!user) {
      return;
    }

    try {
      setActionLoading(true);

      await adminUserService.updateUserStatus(user.id, {
        status,
      });

      await loadUser();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleManualStatusChange() {
    if (!user || !selectedStatus) {
      return;
    }

    await handleStatusChange(selectedStatus);
  }

  if (isLoading) {
    return <Loader label="Cargando usuario..." />;
  }

  if (error) {
    return (
      <EmptyState title="No se pudo cargar el usuario" description={error} />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Usuario no encontrado"
        description="No encontramos información para este usuario."
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title={`${user.firstName} ${user.lastName}`}
        description="Detalle administrativo del usuario registrado en la plataforma."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(paths.admin.users)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button
              variant="secondary"
              disabled={actionLoading}
              onClick={() => setIsResetPasswordOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Restablecer clave
            </Button>

            <Button
              disabled={actionLoading || user.status === "active"}
              onClick={() => handleStatusChange("active")}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activar
            </Button>

            <Button
              variant="secondary"
              disabled={actionLoading || user.status === "inactive"}
              onClick={() => handleStatusChange("inactive")}
            >
              <UserX className="mr-2 h-4 w-4" />
              Inactivar
            </Button>

            <Button
              variant="danger"
              disabled={actionLoading || user.status === "blocked"}
              onClick={() => handleStatusChange("blocked")}
            >
              <Ban className="mr-2 h-4 w-4" />
              Bloquear
            </Button>
          </div>
        }
      />
      {successMessage ? (
        <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Información principal
              </h2>

              <p className="mt-1 text-xs text-ink-500">ID usuario: {user.id}</p>
            </div>

            <Badge variant={getStatusVariant(user.status)}>
              {getStatusLabel(user.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Nombre
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.firstName} {user.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Correo
              </dt>
              <dd className="mt-1 text-sm text-ink-900">{user.email}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.phone ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                WhatsApp
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.whatsapp ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.city ?? "No registrada"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.department ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                País
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {user.country ?? "Colombia"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Email verificado
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {formatDate(user.emailVerifiedAt)}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Biografía</h3>

            <p className="mt-2 text-sm leading-7 text-ink-500">
              {user.bio ?? "Sin biografía registrada."}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-ink-900">Perfil visual</h2>

            <div className="mt-5 flex flex-col items-center rounded-2xl border border-ink-100 bg-ink-50 p-6 text-center">
              {user.profilePhotoUrl ? (
                <img
                  src={buildImageUrl(user.profilePhotoUrl) ?? ""}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-ink-400">
                  <UserRound className="h-10 w-10" />
                </div>
              )}

              <p className="mt-4 font-semibold text-ink-900">
                {user.firstName} {user.lastName}
              </p>

              <p className="mt-1 text-sm text-ink-500">{user.email}</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Rol y relación</h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Rol
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getRoleLabel(user.role?.name)}
                </dd>
                {user.role?.description ? (
                  <p className="mt-1 text-xs text-ink-500">
                    {user.role.description}
                  </p>
                ) : null}
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Perfil emprendedora
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {user.entrepreneur
                    ? `#${user.entrepreneur.id} · ${user.entrepreneur.status}`
                    : "No asociado"}
                </dd>
              </div>

              {user.entrepreneur ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      getAdminEntrepreneurDetailPath(user.entrepreneur!.id),
                    )
                  }
                >
                  Ver perfil de emprendedora
                </Button>
              ) : null}
            </dl>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Actividad</h2>

        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Último login
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {formatDate(user.lastLoginAt)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Creación
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {formatDate(user.createdAt)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Actualización
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {formatDate(user.updatedAt)}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Control manual de estado
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-500">
          Usa esta acción para controlar si el usuario puede acceder o no a la
          plataforma. El cambio de rol no está disponible en esta versión del
          backend.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[260px_auto]">
          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as UserStatus)
            }
          >
            {USER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            disabled={actionLoading || selectedStatus === user.status}
            onClick={handleManualStatusChange}
          >
            Actualizar estado
          </Button>
        </div>
      </Card>
      <AdminResetPasswordModal
        userId={user.id}
        userName={`${user.firstName} ${user.lastName}`}
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        onSuccess={() => {
          setSuccessMessage("Contraseña restablecida correctamente.");
          void loadUser();
        }}
      />
    </section>
  );
}

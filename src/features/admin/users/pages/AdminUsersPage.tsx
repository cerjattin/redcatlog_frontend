import { Ban, Eye, Search, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adminUserService } from "@/features/admin/users/api/adminUser.service";
import type {
  AdminUser,
  AdminUsersPagination,
  UserStatus,
} from "@/features/admin/users/types/adminUser.types";
import { paths } from "@/routes/paths";

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

function getAdminUserDetailPath(id: string) {
  return paths.admin.userDetail.replace(":id", id);
}

export function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<AdminUsersPagination | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminUserService.listUsers({
        page,
        limit: 10,
        search,
        status,
        role,
      });

      setUsers(response.items);
      setPagination(response.pagination);
    } catch {
      setError("No fue posible cargar los usuarios.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, [page, status, role]);

  async function handleSearch() {
    setPage(1);
    await loadUsers();
  }

  async function handleQuickStatusChange(
    userId: string,
    nextStatus: UserStatus,
  ) {
    try {
      setActionLoadingId(userId);

      await adminUserService.updateUserStatus(userId, {
        status: nextStatus,
      });

      await loadUsers();
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando usuarios..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los usuarios"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Gestión de usuarios"
        description="Consulta usuarios, revisa sus roles y controla el estado de acceso a la plataforma."
      />

      <Card className="mb-5">
        <div className="grid gap-4 xl:grid-cols-[1fr_220px_220px_auto]">
          <Input
            placeholder="Buscar por nombre, correo, ciudad o teléfono..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as UserStatus | "");
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="blocked">Bloqueado</option>
            <option value="deleted">Eliminado</option>
          </select>

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los roles</option>
            <option value="admin">Administrador</option>
            <option value="super_admin">Super administrador</option>
            <option value="entrepreneur">Emprendedora</option>
          </select>

          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </Card>

      {users.length === 0 ? (
        <EmptyState
          title="No hay usuarios"
          description="No encontramos usuarios con los filtros actuales."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Usuario
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Rol
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Ubicación
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Último login
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-ink-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100 bg-white">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink-900">
                        {user.firstName} {user.lastName}
                      </p>

                      <p className="mt-1 text-xs text-ink-500">{user.email}</p>

                      <p className="mt-1 text-xs text-ink-400">
                        Tel: {user.phone ?? "No registrado"} · WhatsApp:{" "}
                        {user.whatsapp ?? "No registrado"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-ink-700">
                        <ShieldCheck className="h-4 w-4 text-primary-600" />
                        {getRoleLabel(user.role?.name)}
                      </div>

                      {user.entrepreneur ? (
                        <p className="mt-1 text-xs text-ink-400">
                          Perfil emprendedora #{user.entrepreneur.id} ·{" "}
                          {user.entrepreneur.status}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusVariant(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {user.city ?? "Ciudad no registrada"}
                      {user.department ? `, ${user.department}` : ""}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString("es-CO")
                        : "Sin registro"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(getAdminUserDetailPath(user.id))
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>

                        {user.status !== "active" ? (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleQuickStatusChange(user.id, "active")
                            }
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activar
                          </Button>
                        ) : null}

                        {user.status !== "inactive" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleQuickStatusChange(user.id, "inactive")
                            }
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Inactivar
                          </Button>
                        ) : null}

                        {user.status !== "blocked" ? (
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoadingId === user.id}
                            onClick={() =>
                              handleQuickStatusChange(user.id, "blocked")
                            }
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Bloquear
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pagination ? (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Página {pagination.page} de {pagination.totalPages} ·{" "}
            {pagination.total} usuarios
          </p>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              Anterior
            </Button>

            <Button
              variant="secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

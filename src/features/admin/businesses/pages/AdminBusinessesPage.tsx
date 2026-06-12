import { Archive, Check, Eye, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adminBusinessService } from "@/features/admin/businesses/api/adminBusiness.service";
import type {
  AdminBusiness,
  AdminBusinessPagination,
} from "@/features/admin/businesses/types/adminBusiness.types";
import { paths } from "@/routes/paths";

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
  if (status === "approved" || status === "published") return "success";
  if (status === "pending_review") return "warning";
  if (status === "rejected" || status === "inactive" || status === "archived") {
    return "danger";
  }

  return "neutral";
}

function getAdminBusinessDetailPath(id: string) {
  return paths.admin.businessDetail.replace(":id", id);
}

export function AdminBusinessesPage() {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [pagination, setPagination] = useState<AdminBusinessPagination | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBusinesses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminBusinessService.listBusinesses({
        page,
        limit: 10,
        search: appliedSearch,
        status,
      });

      setBusinesses(response.items);
      setPagination(response.pagination);
    } catch {
      setError("No fue posible cargar los emprendimientos.");
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, status]);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  async function handleSearch() {
    setAppliedSearch(search);
    setPage(1);
  }

  async function handleApprove(businessId: string) {
    try {
      setActionLoadingId(businessId);

      await adminBusinessService.approveBusiness(businessId);

      await loadBusinesses();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(businessId: string) {
    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoadingId(businessId);

      await adminBusinessService.rejectBusiness(businessId, {
        rejectionReason: reason.trim(),
      });

      await loadBusinesses();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleQuickStatusChange(
    businessId: string,
    nextStatus: AdminBusiness["status"],
  ) {
    try {
      setActionLoadingId(businessId);

      await adminBusinessService.updateBusinessStatus(businessId, {
        status: nextStatus,
      });

      await loadBusinesses();
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando emprendimientos..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los emprendimientos"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Gestión de emprendimientos"
        description="Revisa, aprueba, rechaza y controla los emprendimientos registrados por las emprendedoras."
      />

      <Card className="mb-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <Input
            placeholder="Buscar por nombre, slug, ciudad o emprendedora..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="pending_review">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="published">Publicado</option>
            <option value="rejected">Rechazado</option>
            <option value="inactive">Inactivo</option>
            <option value="archived">Archivado</option>
          </select>

          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </Card>

      {businesses.length === 0 ? (
        <EmptyState
          title="No hay emprendimientos"
          description="No encontramos emprendimientos con los filtros actuales."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Emprendimiento
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Emprendedora
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Ubicación
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Categoría
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Productos
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-ink-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100 bg-white">
                {businesses.map((business) => {
                  const entrepreneurUser = business.entrepreneur?.user;

                  return (
                    <tr key={business.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-ink-900">
                          {business.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">
                          /{business.slug}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-ink-600">
                        {entrepreneurUser
                          ? `${entrepreneurUser.firstName} ${entrepreneurUser.lastName}`
                          : "No registrada"}
                        {entrepreneurUser?.email ? (
                          <p className="mt-1 text-xs text-ink-400">
                            {entrepreneurUser.email}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-5 py-4 text-sm text-ink-600">
                        {business.city ?? "Ciudad no registrada"}
                        {business.department ? `, ${business.department}` : ""}
                      </td>

                      <td className="px-5 py-4 text-sm text-ink-600">
                        {business.mainCategory?.name ?? "Sin categoría"}
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant={getStatusVariant(business.status)}>
                          {getStatusLabel(business.status)}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-ink-700">
                        {business.productsCount}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(getAdminBusinessDetailPath(business.id))
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>

                          {business.status !== "published" ? (
                            <Button
                              size="sm"
                              disabled={actionLoadingId === business.id}
                              onClick={() => handleApprove(business.id)}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Aprobar
                            </Button>
                          ) : null}

                          {business.status !== "rejected" ? (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={actionLoadingId === business.id}
                              onClick={() => handleReject(business.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                          ) : null}

                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionLoadingId === business.id}
                            onClick={() =>
                              handleQuickStatusChange(business.id, "archived")
                            }
                          >
                            <Archive className="mr-2 h-4 w-4" />
                            Archivar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {pagination ? (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Página {pagination.page} de {pagination.totalPages} ·{" "}
            {pagination.total} emprendimientos
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

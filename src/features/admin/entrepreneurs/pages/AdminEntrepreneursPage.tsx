import { Check, Eye, Search, Plus, UserX, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adminEntrepreneurService } from "@/features/admin/entrepreneurs/api/adminEntrepreneur.service";
import type {
  AdminEntrepreneur,
  AdminEntrepreneurPagination,
  EntrepreneurStatus,
} from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";
import { paths } from "@/routes/paths";

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

function getAdminEntrepreneurDetailPath(id: string) {
  return paths.admin.entrepreneurDetail.replace(":id", id);
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

function getEntrepreneurEmail(entrepreneur: AdminEntrepreneur) {
  return (
    entrepreneur.email ?? entrepreneur.user?.email ?? "Correo no registrado"
  );
}

function getEntrepreneurPhone(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.phone ?? entrepreneur.user?.phone ?? null;
}

function getEntrepreneurWhatsapp(entrepreneur: AdminEntrepreneur) {
  return entrepreneur.whatsapp ?? entrepreneur.user?.whatsapp ?? null;
}

function getEntrepreneurLocation(entrepreneur: AdminEntrepreneur) {
  const city = entrepreneur.city ?? entrepreneur.user?.city ?? null;
  const department =
    entrepreneur.department ?? entrepreneur.user?.department ?? null;

  if (city && department) {
    return `${city}, ${department}`;
  }

  return city || department || entrepreneur.country || "No registrada";
}

export function AdminEntrepreneursPage() {
  const navigate = useNavigate();

  const [entrepreneurs, setEntrepreneurs] = useState<AdminEntrepreneur[]>([]);
  const [pagination, setPagination] =
    useState<AdminEntrepreneurPagination | null>(null);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState<EntrepreneurStatus | "">("");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadEntrepreneurs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminEntrepreneurService.listEntrepreneurs({
        page,
        limit: 10,
        search: appliedSearch,
        status,
      });

      setEntrepreneurs(response.items);
      setPagination(response.pagination);
    } catch {
      setError("No fue posible cargar las emprendedoras.");
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, status]);

  useEffect(() => {
    void loadEntrepreneurs();
  }, [loadEntrepreneurs]);

  function handleSearch() {
    setAppliedSearch(search);
    setPage(1);
  }

  async function handleApprove(entrepreneurId: string) {
    try {
      setActionLoadingId(entrepreneurId);
      await adminEntrepreneurService.approveEntrepreneur(entrepreneurId);
      await loadEntrepreneurs();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(entrepreneurId: string) {
    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoadingId(entrepreneurId);

      await adminEntrepreneurService.rejectEntrepreneur(entrepreneurId, {
        rejectionReason: reason.trim(),
      });

      await loadEntrepreneurs();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleQuickStatusChange(
    entrepreneurId: string,
    nextStatus: EntrepreneurStatus,
  ) {
    try {
      setActionLoadingId(entrepreneurId);

      await adminEntrepreneurService.updateEntrepreneurStatus(entrepreneurId, {
        status: nextStatus,
      });

      await loadEntrepreneurs();
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando emprendedoras..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar las emprendedoras"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Gestión de emprendedoras"
        description="Revisa perfiles, datos de contacto, categoría, redes sociales y estado de aprobación."
        actions={
          <Button onClick={() => navigate(paths.admin.newEntrepreneur)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva emprendedora
          </Button>
        }
      />

      <Card className="mb-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <Input
            placeholder="Buscar por nombre, correo, ciudad, categoría o documento..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as EntrepreneurStatus | "");
              setPage(1);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="pending_review">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="active">Activa</option>
            <option value="rejected">Rechazada</option>
            <option value="inactive">Inactiva</option>
          </select>

          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
        </div>
      </Card>

      {entrepreneurs.length === 0 ? (
        <EmptyState
          title="No hay emprendedoras"
          description="No encontramos emprendedoras con los filtros actuales."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Emprendedora
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Categoría
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Ubicación
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Contacto
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-ink-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100 bg-white">
                {entrepreneurs.map((entrepreneur) => (
                  <tr key={entrepreneur.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink-900">
                        {getEntrepreneurName(entrepreneur)}
                      </p>

                      <p className="mt-1 text-xs text-ink-500">
                        {getEntrepreneurEmail(entrepreneur)}
                      </p>

                      {entrepreneur.documentNumber ? (
                        <p className="mt-1 text-xs text-ink-400">
                          {entrepreneur.documentType ?? "Doc"}:{" "}
                          {entrepreneur.documentNumber}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {entrepreneur.category?.name ?? "Sin categoría"}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {getEntrepreneurLocation(entrepreneur)}
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      <p>
                        Tel:{" "}
                        {getEntrepreneurPhone(entrepreneur) ?? "No registrado"}
                      </p>
                      <p className="mt-1">
                        WhatsApp:{" "}
                        {getEntrepreneurWhatsapp(entrepreneur) ??
                          "No registrado"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusVariant(entrepreneur.status)}>
                        {getStatusLabel(entrepreneur.status)}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(
                              getAdminEntrepreneurDetailPath(entrepreneur.id),
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>

                        {entrepreneur.status !== "approved" ? (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === entrepreneur.id}
                            onClick={() => handleApprove(entrepreneur.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Aprobar
                          </Button>
                        ) : null}

                        {entrepreneur.status !== "rejected" ? (
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoadingId === entrepreneur.id}
                            onClick={() => handleReject(entrepreneur.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar
                          </Button>
                        ) : null}

                        {entrepreneur.status !== "inactive" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={actionLoadingId === entrepreneur.id}
                            onClick={() =>
                              handleQuickStatusChange(
                                entrepreneur.id,
                                "inactive",
                              )
                            }
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Inactivar
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
            {pagination.total} emprendedoras
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

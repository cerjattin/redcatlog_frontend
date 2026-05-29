import { Archive, Check, Eye, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { adminProductService } from "@/features/admin/products/api/adminProduct.service";
import type { AdminProductPagination } from "@/features/admin/products/types/adminProduct.types";
import type { ProductSummary } from "@/features/products/types/product.types";

import { useNavigate } from "react-router-dom";
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

function getAdminProductDetailPath(id: string) {
  return paths.admin.productDetail.replace(":id", id);
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [pagination, setPagination] = useState<AdminProductPagination | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await adminProductService.listProducts({
        page,
        limit: 10,
        search,
        status,
      });

      setProducts(response.items);
      setPagination(response.pagination);
    } catch {
      setError("No fue posible cargar los productos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, [page, status]);

  async function handleSearch() {
    setPage(1);
    await loadProducts();
  }

  async function handleApprove(productId: string) {
    try {
      setActionLoadingId(productId);

      await adminProductService.approveProduct(productId);

      await loadProducts();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReject(productId: string) {
    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoadingId(productId);

      await adminProductService.rejectProduct(productId, {
        rejectionReason: reason,
      });

      await loadProducts();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleQuickStatusChange(
    productId: string,
    status: ProductSummary["status"],
  ) {
    try {
      setActionLoadingId(productId);

      await adminProductService.updateProductStatus(productId, {
        status,
      });

      await loadProducts();
    } finally {
      setActionLoadingId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando productos..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los productos"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Gestión de productos"
        description="Revisa, aprueba, rechaza y controla el estado de los productos publicados por las emprendedoras."
      />

      <Card className="mb-5">
        <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">
          <Input
            placeholder="Buscar por nombre, slug o descripción..."
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

      {products.length === 0 ? (
        <EmptyState
          title="No hay productos"
          description="No encontramos productos con los filtros actuales."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-100">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Producto
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Emprendimiento
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Estado
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-ink-500">
                    Precio
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-ink-500">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ink-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-ink-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        /{product.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-ink-600">
                      {product.business?.name ?? "No registrado"}
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant={getStatusVariant(product.status)}>
                        {getStatusLabel(product.status)}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-ink-700">
                      {product.hasPrice === false
                        ? "Consultar"
                        : (product.price?.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                            maximumFractionDigits: 0,
                          }) ?? "No registrado")}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            navigate(getAdminProductDetailPath(product.id))
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>

                        {product.status !== "published" ? (
                          <Button
                            size="sm"
                            disabled={actionLoadingId === product.id}
                            onClick={() => handleApprove(product.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Aprobar
                          </Button>
                        ) : null}

                        {product.status !== "rejected" ? (
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={actionLoadingId === product.id}
                            onClick={() => handleReject(product.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Rechazar
                          </Button>
                        ) : null}
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={actionLoadingId === product.id}
                          onClick={() =>
                            handleQuickStatusChange(product.id, "archived")
                          }
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Archivar
                        </Button>
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
            {pagination.total} productos
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

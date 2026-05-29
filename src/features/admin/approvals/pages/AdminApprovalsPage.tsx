import {
  ArrowRight,
  BriefcaseBusiness,
  Package,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminBusinessService } from "@/features/admin/businesses/api/adminBusiness.service";
import type { AdminBusiness } from "@/features/admin/businesses/types/adminBusiness.types";
import { adminEntrepreneurService } from "@/features/admin/entrepreneurs/api/adminEntrepreneur.service";
import type { AdminEntrepreneur } from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";
import { adminProductService } from "@/features/admin/products/api/adminProduct.service";
import type { ProductSummary } from "@/features/products/types/product.types";
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

function getAdminProductDetailPath(id: string) {
  return paths.admin.productDetail.replace(":id", id);
}

function getAdminBusinessDetailPath(id: string) {
  return paths.admin.businessDetail.replace(":id", id);
}

function getAdminEntrepreneurDetailPath(id: string) {
  return paths.admin.entrepreneurDetail.replace(":id", id);
}

export function AdminApprovalsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<AdminEntrepreneur[]>([]);

  const [productTotal, setProductTotal] = useState(0);
  const [businessTotal, setBusinessTotal] = useState(0);
  const [entrepreneurTotal, setEntrepreneurTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadApprovals() {
    try {
      setIsLoading(true);
      setError(null);

      const [productResponse, businessResponse, entrepreneurResponse] =
        await Promise.all([
          adminProductService.listProducts({
            page: 1,
            limit: 5,
            status: "pending_review",
          }),
          adminBusinessService.listBusinesses({
            page: 1,
            limit: 5,
            status: "pending_review",
          }),
          adminEntrepreneurService.listEntrepreneurs({
            page: 1,
            limit: 5,
            status: "pending_review",
          }),
        ]);

      setProducts(productResponse.items);
      setBusinesses(businessResponse.items);
      setEntrepreneurs(entrepreneurResponse.items);

      setProductTotal(productResponse.pagination.total);
      setBusinessTotal(businessResponse.pagination.total);
      setEntrepreneurTotal(entrepreneurResponse.pagination.total);
    } catch {
      setError("No fue posible cargar el centro de aprobaciones.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadApprovals();
  }, []);

  if (isLoading) {
    return <Loader label="Cargando aprobaciones..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar el centro de aprobaciones"
        description={error}
      />
    );
  }

  const totalPending = productTotal + businessTotal + entrepreneurTotal;

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title="Centro de aprobaciones"
        description="Revisa rápidamente los productos, emprendimientos y perfiles pendientes de validación."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <Package className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-ink-500">Productos pendientes</p>
              <strong className="text-2xl text-ink-900">{productTotal}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-ink-500">Emprendimientos pendientes</p>
              <strong className="text-2xl text-ink-900">{businessTotal}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <UserRoundCheck className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-ink-500">Emprendedoras pendientes</p>
              <strong className="text-2xl text-ink-900">
                {entrepreneurTotal}
              </strong>
            </div>
          </div>
        </Card>
      </div>

      {totalPending === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No hay aprobaciones pendientes"
            description="En este momento no hay productos, emprendimientos ni perfiles pendientes de revisión."
          />
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Productos</h2>
              <p className="mt-1 text-sm text-ink-500">
                Últimos productos pendientes.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                navigate(`${paths.admin.products}?status=pending_review`)
              }
            >
              Ver todos
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="space-y-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="w-full rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                  onClick={() =>
                    navigate(getAdminProductDetailPath(product.id))
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink-900">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        {product.business?.name ?? "Sin emprendimiento"}
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center text-xs font-semibold text-primary-600">
                    Revisar producto
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">No hay productos pendientes.</p>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Emprendimientos
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Últimos emprendimientos pendientes.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                navigate(`${paths.admin.businesses}?status=pending_review`)
              }
            >
              Ver todos
            </Button>
          </div>

          {businesses.length > 0 ? (
            <div className="space-y-3">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  type="button"
                  className="w-full rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
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
                        {business.city ?? "Ciudad no registrada"}
                        {business.department ? `, ${business.department}` : ""}
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(business.status)}>
                      {getStatusLabel(business.status)}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center text-xs font-semibold text-primary-600">
                    Revisar emprendimiento
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">
              No hay emprendimientos pendientes.
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Emprendedoras</h2>
              <p className="mt-1 text-sm text-ink-500">
                Últimos perfiles pendientes.
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                navigate(`${paths.admin.entrepreneurs}?status=pending_review`)
              }
            >
              Ver todos
            </Button>
          </div>

          {entrepreneurs.length > 0 ? (
            <div className="space-y-3">
              {entrepreneurs.map((entrepreneur) => {
                const user = entrepreneur.user;

                return (
                  <button
                    key={entrepreneur.id}
                    type="button"
                    className="w-full rounded-2xl border border-ink-100 bg-ink-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                    onClick={() =>
                      navigate(getAdminEntrepreneurDetailPath(entrepreneur.id))
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink-900">
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : "Usuario no registrado"}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">
                          {user?.email ?? "Correo no registrado"}
                        </p>
                      </div>

                      <Badge variant={getStatusVariant(entrepreneur.status)}>
                        {getStatusLabel(entrepreneur.status)}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center text-xs font-semibold text-primary-600">
                      Revisar emprendedora
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-ink-500">
              No hay emprendedoras pendientes.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}

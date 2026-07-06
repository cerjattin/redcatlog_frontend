import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Package,
  Plus,
  Tags,
  UserRoundCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { categoryService } from "@/features/admin/categories/api/category.service";
import { adminEntrepreneurService } from "@/features/admin/entrepreneurs/api/adminEntrepreneur.service";
import type { AdminEntrepreneur } from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";
import { adminProductService } from "@/features/admin/products/api/adminProduct.service";
import type { ProductSummary } from "@/features/products/types/product.types";
import { paths } from "@/routes/paths";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

type EditorDashboardState = {
  entrepreneursTotal: number;
  productsTotal: number;
  categoriesTotal: number;
  pendingProductsTotal: number;
  pendingEntrepreneursTotal: number;
  recentProducts: ProductSummary[];
  recentEntrepreneurs: AdminEntrepreneur[];
};

const initialEditorDashboardState: EditorDashboardState = {
  entrepreneursTotal: 0,
  productsTotal: 0,
  categoriesTotal: 0,
  pendingProductsTotal: 0,
  pendingEntrepreneursTotal: 0,
  recentProducts: [],
  recentEntrepreneurs: [],
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente",
    approved: "Aprobado",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
    archived: "Archivado",
    active: "Activo",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string): BadgeVariant {
  if (status === "approved" || status === "published" || status === "active") {
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

function getProductEntrepreneurName(product: ProductSummary) {
  const entrepreneur = product.entrepreneur;

  if (!entrepreneur) {
    return "Sin emprendedora";
  }

  const fullName = entrepreneur.fullName?.trim();

  if (fullName) {
    return fullName;
  }

  const firstName = entrepreneur.firstName?.trim() ?? "";
  const lastName = entrepreneur.lastName?.trim() ?? "";
  const name = `${firstName} ${lastName}`.trim();

  return name || `Emprendedora #${entrepreneur.id}`;
}

function getAdminProductDetailPath(id: string) {
  return paths.admin.productDetail.replace(":id", id);
}

function getAdminEntrepreneurDetailPath(id: string) {
  return paths.admin.entrepreneurDetail.replace(":id", id);
}

function StatCard({
  label,
  value,
  status,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  status: string;
  icon: typeof Package;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-500">{label}</p>

            <strong className="mt-2 block text-3xl text-ink-900">
              {value}
            </strong>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        <div className="mt-4">
          <Badge variant="neutral">{status}</Badge>
        </div>
      </Card>
    </Link>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof Package;
}) {
  return (
    <Link to={href}>
      <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-4 font-bold text-ink-900">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-ink-500">{description}</p>

        <span className="mt-4 inline-flex items-center text-sm font-bold text-primary-600">
          Gestionar
          <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </Card>
    </Link>
  );
}

export function EditorDashboardPage() {
  const [dashboard, setDashboard] = useState<EditorDashboardState>(
    initialEditorDashboardState,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [
          entrepreneursResult,
          productsResult,
          categoriesResult,
          pendingProductsResult,
          pendingEntrepreneursResult,
        ] = await Promise.allSettled([
          adminEntrepreneurService.listEntrepreneurs({
            page: 1,
            limit: 5,
          }),
          adminProductService.listProducts({
            page: 1,
            limit: 5,
          }),
          categoryService.listCategories({
            isActive: "true",
          }),
          adminProductService.listProducts({
            page: 1,
            limit: 1,
            status: "pending_review",
          }),
          adminEntrepreneurService.listEntrepreneurs({
            page: 1,
            limit: 1,
            status: "pending_review",
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setDashboard({
          entrepreneursTotal:
            entrepreneursResult.status === "fulfilled"
              ? entrepreneursResult.value.pagination.total
              : 0,
          productsTotal:
            productsResult.status === "fulfilled"
              ? productsResult.value.pagination.total
              : 0,
          categoriesTotal:
            categoriesResult.status === "fulfilled"
              ? categoriesResult.value.length
              : 0,
          pendingProductsTotal:
            pendingProductsResult.status === "fulfilled"
              ? pendingProductsResult.value.pagination.total
              : 0,
          pendingEntrepreneursTotal:
            pendingEntrepreneursResult.status === "fulfilled"
              ? pendingEntrepreneursResult.value.pagination.total
              : 0,
          recentProducts:
            productsResult.status === "fulfilled"
              ? productsResult.value.items
              : [],
          recentEntrepreneurs:
            entrepreneursResult.status === "fulfilled"
              ? entrepreneursResult.value.items
              : [],
        });

        const hasTotalFailure =
          entrepreneursResult.status === "rejected" &&
          productsResult.status === "rejected" &&
          categoriesResult.status === "rejected";

        if (hasTotalFailure) {
          setLoadError("No fue posible cargar el dashboard editorial.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPending = useMemo(() => {
    return dashboard.pendingProductsTotal + dashboard.pendingEntrepreneursTotal;
  }, [dashboard.pendingEntrepreneursTotal, dashboard.pendingProductsTotal]);

  if (isLoading) {
    return <Loader label="Cargando panel editorial..." />;
  }

  if (loadError) {
    return (
      <EmptyState
        title="No se pudo cargar el panel editorial"
        description={loadError}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Editor"
        title="Panel editorial"
        description="Gestiona emprendedoras, productos, categorías, imágenes, estados y aprobaciones de REDMUEMMA."
        actions={
          <Button onClick={() => window.location.reload()}>
            Actualizar datos
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Emprendedoras"
          value={dashboard.entrepreneursTotal}
          status="Perfiles disponibles"
          icon={UserRoundCheck}
          href={paths.admin.entrepreneurs}
        />

        <StatCard
          label="Productos"
          value={dashboard.productsTotal}
          status="Productos creados"
          icon={Package}
          href={paths.admin.products}
        />

        <StatCard
          label="Categorías"
          value={dashboard.categoriesTotal}
          status="Activas"
          icon={Tags}
          href={paths.admin.categories}
        />

        <StatCard
          label="Pendientes"
          value={totalPending}
          status="Por revisar"
          icon={ClipboardCheck}
          href={paths.admin.approvals}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-amber-100 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-amber-700">
                Trabajo pendiente
              </p>

              <strong className="mt-2 block text-4xl text-amber-900">
                {totalPending}
              </strong>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                {dashboard.pendingProductsTotal} productos ·{" "}
                {dashboard.pendingEntrepreneursTotal} emprendedoras
              </p>

              <Link
                to={paths.admin.approvals}
                className="mt-5 inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700"
              >
                Abrir centro de aprobaciones
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">
            Acciones editoriales
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              title="Emprendedoras"
              description="Crear, editar y revisar perfiles."
              href={paths.admin.entrepreneurs}
              icon={UserRoundCheck}
            />

            <ActionCard
              title="Productos"
              description="Crear productos y cargar imágenes."
              href={paths.admin.products}
              icon={Package}
            />

            <ActionCard
              title="Categorías"
              description="Organizar catálogo y perfiles."
              href={paths.admin.categories}
              icon={Tags}
            />

            <ActionCard
              title="Aprobaciones"
              description="Revisar contenido pendiente."
              href={paths.admin.approvals}
              icon={ClipboardCheck}
            />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Productos recientes
              </h2>

              <p className="mt-1 text-sm text-ink-500">
                Últimos productos administrados.
              </p>
            </div>

            <Link
              to={paths.admin.products}
              className="text-sm font-bold text-primary-600"
            >
              Ver productos
            </Link>
          </div>

          {dashboard.recentProducts.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentProducts.map((product) => (
                <Link
                  key={product.id}
                  to={getAdminProductDetailPath(product.id)}
                  className="block rounded-2xl border border-ink-100 bg-ink-50 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-ink-500">
                        {getProductEntrepreneurName(product)}
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">
              No hay productos registrados todavía.
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Emprendedoras recientes
              </h2>

              <p className="mt-1 text-sm text-ink-500">
                Últimos perfiles administrados.
              </p>
            </div>

            <Link
              to={paths.admin.entrepreneurs}
              className="text-sm font-bold text-primary-600"
            >
              Ver emprendedoras
            </Link>
          </div>

          {dashboard.recentEntrepreneurs.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentEntrepreneurs.map((entrepreneur) => (
                <Link
                  key={entrepreneur.id}
                  to={getAdminEntrepreneurDetailPath(entrepreneur.id)}
                  className="block rounded-2xl border border-ink-100 bg-ink-50 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink-900">
                        {getEntrepreneurName(entrepreneur)}
                      </p>

                      <p className="mt-1 text-xs text-ink-500">
                        {entrepreneur.email ??
                          entrepreneur.user?.email ??
                          "Correo no registrado"}
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(entrepreneur.status)}>
                      {getStatusLabel(entrepreneur.status)}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-500">
              No hay emprendedoras registradas todavía.
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink-900">
              Operación editorial REDMUEMMA
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-500">
              El editor administra el contenido diario de la plataforma:
              emprendedoras, productos, categorías, imágenes y estados de
              publicación.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={paths.admin.newProduct}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-600 px-4 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear producto
            </Link>

            <Link
              to={paths.admin.approvals}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-ink-100 bg-white px-4 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Revisar pendientes
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}

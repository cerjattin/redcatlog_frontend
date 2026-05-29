import { ArrowLeft, Check, ImageOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { adminProductService } from "@/features/admin/products/api/adminProduct.service";
import type { ProductSummary } from "@/features/products/types/product.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";
import { PRODUCT_STATUS_OPTIONS } from "@/features/products/constants/productStatus.constants";
import type { ProductStatus } from "@/features/products/types/product.types";

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

function formatPrice(price?: number | null) {
  if (price === null || price === undefined) {
    return "Precio no registrado";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AdminProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");

  async function loadProduct() {
    if (!params.id) {
      setError("No se encontró el identificador del producto.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await adminProductService.getProductById(params.id);

      setProduct(data);
      setSelectedStatus(data.status);
    } catch {
      setError("No fue posible cargar el producto.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadProduct();
  }, [params.id]);

  async function handleStatusChange() {
    if (!product || !selectedStatus) {
      return;
    }

    try {
      setActionLoading(true);

      await adminProductService.updateProductStatus(product.id, {
        status: selectedStatus,
      });

      await loadProduct();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove() {
    if (!product) return;

    try {
      setActionLoading(true);
      await adminProductService.approveProduct(product.id);
      await loadProduct();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!product) return;

    const reason = window.prompt("Motivo de rechazo");

    if (!reason || reason.trim().length < 3) {
      return;
    }

    try {
      setActionLoading(true);

      await adminProductService.rejectProduct(product.id, {
        rejectionReason: reason.trim(),
      });

      await loadProduct();
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando producto..." />;
  }

  if (error) {
    return (
      <EmptyState title="No se pudo cargar el producto" description={error} />
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Producto no encontrado"
        description="No encontramos información para este producto."
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Administración"
        title={product.name}
        description={
          product.shortDescription ?? "Detalle administrativo del producto."
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(paths.admin.products)}
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
              <p className="mt-1 text-xs text-ink-500">/{product.slug}</p>
            </div>

            <Badge variant={getStatusVariant(product.status)}>
              {getStatusLabel(product.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Precio
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {product.hasPrice === false
                  ? "Consultar precio"
                  : formatPrice(product.price)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Stock
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {product.managesStock ? (product.stock ?? 0) : "No aplica"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Emprendimiento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {product.business?.name ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Categoría
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {product.category?.name ?? "Sin categoría"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Descripción</h3>
            <p className="mt-2 text-sm leading-7 text-ink-500">
              {product.description ?? "Sin descripción registrada."}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Imágenes</h2>

          <div className="mt-5 grid gap-4">
            {product.images?.length ? (
              product.images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-ink-100"
                >
                  <img
                    src={buildImageUrl(image.imageUrl) ?? ""}
                    alt={image.altText ?? product.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-ink-100 bg-ink-50 text-ink-400">
                <ImageOff className="h-8 w-8" />
                <p className="mt-3 text-sm">Sin imágenes</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Control manual de estado
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-500">
          Usa esta acción solo cuando necesites ajustar manualmente el estado
          del producto desde administración.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-[260px_auto]">
          <select
            className="h-11 rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value as ProductStatus)
            }
          >
            {PRODUCT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            disabled={actionLoading || selectedStatus === product.status}
            onClick={handleStatusChange}
          >
            Actualizar estado
          </Button>
        </div>
      </Card>
      {product.rejectionReason ? (
        <Card className="mt-4 border-red-100 bg-red-50">
          <h2 className="text-lg font-bold text-red-800">Motivo de rechazo</h2>
          <p className="mt-3 text-sm leading-7 text-red-700">
            {product.rejectionReason}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

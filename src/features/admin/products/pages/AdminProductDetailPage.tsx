import {
  ArrowLeft,
  Check,
  ExternalLink,
  ImageOff,
  Images,
  Pencil,
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
import { adminProductService } from "@/features/admin/products/api/adminProduct.service";
import { PRODUCT_STATUS_OPTIONS } from "@/features/products/constants/productStatus.constants";
import type {
  ProductStatus,
  ProductSummary,
} from "@/features/products/types/product.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

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

function formatPrice(price?: string | number | null) {
  if (price === null || price === undefined || price === "") {
    return "Precio no registrado";
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "Precio no registrado";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(numericPrice);
}

function getEditProductPath(id: string) {
  return paths.admin.editProduct.replace(":id", id);
}

function getProductImagesPath(id: string) {
  return paths.admin.productImages.replace(":id", id);
}

function getEntrepreneurName(product: ProductSummary) {
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

function getEntrepreneurContact(product: ProductSummary) {
  const entrepreneur = product.entrepreneur;

  return {
    email: entrepreneur?.email ?? null,
    phone: entrepreneur?.phone ?? null,
    whatsapp: entrepreneur?.whatsapp ?? null,
    city: entrepreneur?.city ?? null,
    department: entrepreneur?.department ?? null,
    instagramUrl: entrepreneur?.instagramUrl ?? null,
    facebookUrl: entrepreneur?.facebookUrl ?? null,
    tiktokUrl: entrepreneur?.tiktokUrl ?? null,
    websiteUrl: entrepreneur?.websiteUrl ?? null,
  };
}

function getDisplayValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "No registrado";
  }

  return String(value);
}

export function AdminProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");

  const loadProduct = useCallback(async () => {
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
  }, [params.id]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

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

  const contact = getEntrepreneurContact(product);

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

            <Button
              variant="secondary"
              onClick={() => navigate(getEditProductPath(product.id))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate(getProductImagesPath(product.id))}
            >
              <Images className="mr-2 h-4 w-4" />
              Imágenes
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
                Emprendedora
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-900">
                {getEntrepreneurName(product)}
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
                Destacado
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {product.isFeatured ? "Sí" : "No"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Publicación
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {product.publishedAt
                  ? new Date(product.publishedAt).toLocaleString("es-CO")
                  : "No publicado"}
              </dd>
            </div>
          </dl>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">
              Descripción corta
            </h3>
            <p className="mt-2 text-sm leading-7 text-ink-500">
              {product.shortDescription ?? "Sin descripción corta registrada."}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-ink-900">Descripción</h3>
            <p className="mt-2 text-sm leading-7 text-ink-500">
              {product.description ?? "Sin descripción registrada."}
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-ink-900">
              Contacto de emprendedora
            </h2>

            <dl className="mt-4 grid gap-4">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Correo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contact.email)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Teléfono
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contact.phone)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contact.whatsapp)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Ubicación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {[contact.city, contact.department]
                    .filter(Boolean)
                    .join(", ") || "No registrada"}
                </dd>
              </div>
            </dl>
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

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Redes</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {contact.instagramUrl ? (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Instagram
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {contact.facebookUrl ? (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Facebook
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {contact.tiktokUrl ? (
                <a
                  href={contact.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  TikTok
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {contact.websiteUrl ? (
                <a
                  href={contact.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-ink-100 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
                >
                  Sitio web
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </a>
              ) : null}

              {!contact.instagramUrl &&
              !contact.facebookUrl &&
              !contact.tiktokUrl &&
              !contact.websiteUrl ? (
                <p className="text-sm text-ink-500">
                  No hay redes registradas.
                </p>
              ) : null}
            </div>
          </Card>
        </div>
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

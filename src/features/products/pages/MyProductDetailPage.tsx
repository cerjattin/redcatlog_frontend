import { ImageOff, Pencil, Images } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { productService } from "@/features/products/api/product.service";
import type { ProductSummary } from "@/features/products/types/product.types";
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

function getProductEditPath(id: string) {
  return paths.entrepreneur.editProduct.replace(":id", id);
}

function getProductImagesPath(id: string) {
  return paths.entrepreneur.productImages.replace(":id", id);
}

export function MyProductDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) return;

      try {
        setIsLoading(true);

        const data = await productService.getMyProductById(params.id);

        setProduct(data);
      } catch {
        setError("No fue posible cargar el detalle del producto.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [params.id]);

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
        description="No encontramos información del producto."
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Producto"
        title={product.name}
        description={product.shortDescription ?? "Detalle del producto."}
        actions={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(getProductImagesPath(product.id))}
            >
              <Images className="mr-2 h-4 w-4" />
              Imágenes
            </Button>

            <Button onClick={() => navigate(getProductEditPath(product.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between">
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

          <p className="mt-6 text-sm leading-7 text-ink-500">
            {product.description ?? "Sin descripción registrada."}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card>
              <p className="text-xs uppercase text-ink-500">Precio</p>

              <p className="mt-2 text-xl font-bold text-ink-900">
                {product.hasPrice === false
                  ? "Consultar precio"
                  : formatPrice(product.price)}
              </p>
            </Card>

            <Card>
              <p className="text-xs uppercase text-ink-500">Stock</p>

              <p className="mt-2 text-xl font-bold text-ink-900">
                {product.managesStock ? (product.stock ?? 0) : "No aplica"}
              </p>
            </Card>
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
                    className="h-56 w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-ink-100 bg-ink-50 text-ink-400">
                <ImageOff className="h-8 w-8" />
                <p className="mt-3 text-sm">Sin imágenes</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

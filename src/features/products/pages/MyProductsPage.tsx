import { ImageOff, Package, Plus, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { productService } from "@/features/products/api/product.service";
import type { ProductSummary } from "@/features/products/types/product.types";
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

function getProductDetailPath(id: string) {
  return paths.entrepreneur.productDetail.replace(":id", id);
}

export function MyProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await productService.listMyProducts();

        setProducts(data);
      } catch {
        setError("No fue posible cargar tus productos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

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
        eyebrow="Productos"
        title="Mis productos"
        description="Consulta y administra los productos asociados a tus emprendimientos."
        actions={
          <Button onClick={() => navigate(paths.entrepreneur.newProduct)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title="Aún no tienes productos"
          description="Cuando registres productos, aparecerán en este listado."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const mainImage =
              product.images?.find((image) => image.isMain) ??
              product.images?.[0];

            return (
              <Card
                key={product.id}
                className="cursor-pointer overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => navigate(getProductDetailPath(product.id))}
              >
                <div className="flex h-44 items-center justify-center bg-ink-50">
                  {mainImage?.imageUrl ? (
                    <img
                      src={buildImageUrl(mainImage.imageUrl) ?? ""}
                      alt={mainImage.altText ?? product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-sm text-ink-400">
                      <ImageOff className="h-7 w-7" />
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-ink-900">
                        {product.name}
                      </h2>

                      <p className="mt-1 text-xs text-ink-500">
                        /{product.slug}
                      </p>
                    </div>

                    <Badge variant={getStatusVariant(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-500">
                    {product.shortDescription ??
                      product.description ??
                      "Sin descripción registrada."}
                  </p>

                  <div className="mt-5 border-t border-ink-100 pt-4 text-sm text-ink-500">
                    <p className="font-semibold text-ink-900">
                      {product.hasPrice === false
                        ? "Consultar precio"
                        : formatPrice(product.price)}
                    </p>

                    <p className="mt-1">
                      Emprendimiento:{" "}
                      {product.business?.name ?? "No registrado"}
                    </p>

                    <p className="mt-1">
                      Categoría: {product.category?.name ?? "Sin categoría"}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={(event) => {
                      event.stopPropagation();

                      navigate(getProductDetailPath(product.id));
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalle
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

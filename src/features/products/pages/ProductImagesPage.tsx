import { ArrowLeft, ImageOff, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { productService } from "@/features/products/api/product.service";
import type { ProductSummary } from "@/features/products/types/product.types";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE_MB = 3;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getProductDetailPath(id: string) {
  return paths.admin.productDetail.replace(":id", id);
}

function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Formato no permitido. Usa JPG, PNG o WEBP.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `La imagen no puede superar ${MAX_IMAGE_SIZE_MB} MB.`;
  }

  return null;
}

export function ProductImagesPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const images = product?.images ?? [];
  const canUpload = images.length < MAX_IMAGES;

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) {
        setError("No se encontró el identificador del producto.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await productService.getMyProductById(params.id);

        setProduct(data);
      } catch {
        setError("No fue posible cargar las imágenes del producto.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [params.id]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setError(null);
    setSelectedFile(null);
    setPreviewUrl(null);

    if (!file) {
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    event.target.value = "";
  }

  function handleClearSelectedFile() {
    setSelectedFile(null);
    setPreviewUrl(null);
  }

  async function handleUpload() {
    if (!params.id || !selectedFile) {
      return;
    }

    if (!canUpload) {
      setError(`El producto puede tener máximo ${MAX_IMAGES} imágenes.`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const updatedProduct = await productService.uploadProductImage(
        params.id,
        selectedFile,
      );

      setProduct(updatedProduct);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch {
      setError("No fue posible subir la imagen del producto.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    if (!params.id) {
      return;
    }

    const shouldDelete = window.confirm(
      "¿Seguro que deseas eliminar esta imagen?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingImageId(imageId);
      setError(null);

      await productService.deleteProductImage(params.id, imageId);

      setProduct((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          images: current.images?.filter((image) => image.id !== imageId),
        };
      });
    } catch {
      setError("No fue posible eliminar la imagen.");
    } finally {
      setDeletingImageId(null);
    }
  }

  if (isLoading) {
    return <Loader label="Cargando imágenes..." />;
  }

  if (error && !product) {
    return (
      <EmptyState
        title="No se pudieron cargar las imágenes"
        description={error}
      />
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
        eyebrow="Producto"
        title={`Imágenes de ${product.name}`}
        description={`Carga, revisa o elimina imágenes del producto. Máximo ${MAX_IMAGES} imágenes.`}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(getProductDetailPath(product.id))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        }
      />

      {error ? (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-bold text-ink-900">
            Imágenes actuales ({images.length}/{MAX_IMAGES})
          </h2>

          {images.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {images.map((image) => {
                const imageUrl = buildImageUrl(image.imageUrl);

                return (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={image.altText ?? product.name}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center bg-ink-50 text-ink-400">
                        <ImageOff className="h-8 w-8" />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 bg-white p-4">
                      <div>
                        <p className="text-sm font-semibold text-ink-900">
                          {image.isMain ? "Principal" : "Imagen"}
                        </p>

                        <p className="text-xs text-ink-500">
                          {image.altText ?? "Sin texto alternativo"}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        isLoading={deletingImageId === image.id}
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-100 bg-ink-50 text-ink-400">
              <ImageOff className="h-8 w-8" />
              <p className="mt-3 text-sm">
                Este producto aún no tiene imágenes.
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Subir nueva imagen</h2>

          <p className="mt-2 text-sm leading-6 text-ink-500">
            Selecciona una imagen JPG, PNG o WEBP · Máximo {MAX_IMAGE_SIZE_MB}{" "}
            MB. El producto puede tener máximo {MAX_IMAGES} imágenes.
          </p>

          {!canUpload ? (
            <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              Este producto ya tiene el máximo de imágenes permitido.
            </div>
          ) : null}

          <div className="mt-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50 px-4 py-8 text-center transition hover:bg-white">
              <Upload className="h-8 w-8 text-primary-600" />

              <span className="mt-3 text-sm font-semibold text-ink-900">
                Seleccionar imagen
              </span>

              <span className="mt-1 text-xs text-ink-500">
                JPG, PNG o WEBP · Máximo {MAX_IMAGE_SIZE_MB} MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={!canUpload || isUploading}
                onChange={handleFileChange}
              />
            </label>
          </div>

          {previewUrl ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-ink-100">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="h-56 w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              disabled={!selectedFile || !canUpload}
              isLoading={isUploading}
              onClick={handleUpload}
            >
              <Upload className="mr-2 h-4 w-4" />
              Subir imagen
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!selectedFile || isUploading}
              onClick={handleClearSelectedFile}
            >
              Limpiar
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

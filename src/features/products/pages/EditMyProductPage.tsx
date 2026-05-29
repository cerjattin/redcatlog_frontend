import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

import { categoryService } from "@/features/admin/categories/api/category.service";
import type { Category } from "@/features/admin/categories/types/category.types";

import { productService } from "@/features/products/api/product.service";

import {
  productSchema,
  type ProductFormValues,
} from "@/features/products/schemas/product.schema";

import { paths } from "@/routes/paths";

function normalizeValue(value?: string | number | null) {
  return value ?? "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible actualizar el producto.";
  }

  return "No fue posible actualizar el producto.";
}

function getProductDetailPath(id: string) {
  return paths.entrepreneur.productDetail.replace(":id", id);
}

export function EditMyProductPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: "",
      name: "",
      shortDescription: "",
      description: "",
      price: undefined,
      hasPrice: true,
      stock: undefined,
      managesStock: true,
    },
  });

  const hasPrice = watch("hasPrice");
  const managesStock = watch("managesStock");

  useEffect(() => {
    async function loadProduct() {
      if (!params.id) {
        setLoadError("No se encontró el identificador del producto.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const product = await productService.getMyProductById(params.id);

        try {
          const categoryData = await categoryService.listCategories({
            type: "product",
            isActive: "true",
          });

          setCategories(categoryData);
        } catch {
          setCategories([]);
        }

        reset({
          categoryId: product.categoryId ?? "",
          name: product.name,
          shortDescription: normalizeValue(product.shortDescription) as string,
          description: normalizeValue(product.description) as string,
          price: product.price ?? undefined,
          hasPrice: product.hasPrice ?? true,
          stock: product.stock ?? undefined,
          managesStock: product.managesStock ?? true,
        });
      } catch {
        setLoadError("No fue posible cargar el producto para edición.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProduct();
  }, [params.id, reset]);

  async function onSubmit(values: ProductFormValues) {
    if (!params.id) {
      setSubmitError("No se encontró el identificador del producto.");

      return;
    }

    try {
      setSubmitError(null);

      await productService.updateMyProduct(params.id, {
        ...values,

        categoryId: values.categoryId || null,

        price: values.hasPrice ? values.price : null,

        stock: values.managesStock ? values.stock : null,
      });

      navigate(getProductDetailPath(params.id));
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  if (isLoading) {
    return <Loader label="Cargando formulario..." />;
  }

  if (loadError) {
    return (
      <EmptyState
        title="No se pudo cargar el formulario"
        description={loadError}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Producto"
        title="Editar producto"
        description="Actualiza la información comercial del producto."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              if (params.id) {
                navigate(getProductDetailPath(params.id));
              } else {
                navigate(paths.entrepreneur.products);
              }
            }}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Categoría
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("categoryId")}
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                {categories.length === 0 ? (
                  <p className="mt-2 text-xs text-amber-600">
                    No hay categorías disponibles para seleccionar o no tienes
                    permisos para consultarlas.
                  </p>
                ) : null}
              </select>
            </label>

            <Input
              label="Nombre del producto"
              placeholder="Ej: Bolso artesanal tejido"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Precio"
              type="number"
              placeholder="85000"
              disabled={!hasPrice}
              error={errors.price?.message}
              {...register("price", {
                setValueAs: (value) =>
                  value === "" || value === null || value === undefined
                    ? undefined
                    : Number(value),
              })}
            />

            <label className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-300 text-primary-600"
                {...register("hasPrice")}
              />
              Producto con precio visible
            </label>

            <Input
              label="Stock"
              type="number"
              placeholder="10"
              disabled={!managesStock}
              error={errors.stock?.message}
              {...register("stock", {
                setValueAs: (value) =>
                  value === "" || value === null || value === undefined
                    ? undefined
                    : Number(value),
              })}
            />

            <label className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-300 text-primary-600"
                {...register("managesStock")}
              />
              Gestiona inventario
            </label>
          </div>

          <div className="mt-5 grid gap-5">
            <Textarea
              label="Descripción corta"
              placeholder="Resumen breve del producto..."
              error={errors.shortDescription?.message}
              {...register("shortDescription")}
            />

            <Textarea
              label="Descripción completa"
              placeholder="Describe materiales, elaboración, uso y características..."
              error={errors.description?.message}
              {...register("description")}
            />
          </div>

          {submitError ? (
            <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (params.id) {
                  navigate(getProductDetailPath(params.id));
                }
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

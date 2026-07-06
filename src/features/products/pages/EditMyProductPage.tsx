import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { adminEntrepreneurService } from "@/features/admin/entrepreneurs/api/adminEntrepreneur.service";
import type { AdminEntrepreneur } from "@/features/admin/entrepreneurs/types/adminEntrepreneur.types";
import { productService } from "@/features/products/api/product.service";
import {
  productSchema,
  type ProductFormValues,
} from "@/features/products/schemas/product.schema";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";

function toNumberOrUndefined(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function normalizeText(value?: string | number | null) {
  return value === null || value === undefined ? "" : String(value);
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible actualizar el producto.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible actualizar el producto.";
}

function getProductDetailPath(id: string) {
  return paths.admin.productDetail.replace(":id", id);
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

export function EditMyProductPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [entrepreneurs, setEntrepreneurs] = useState<AdminEntrepreneur[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      entrepreneurId: "",
      categoryId: null,
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      price: undefined,
      hasPrice: true,
      stock: undefined,
      managesStock: true,
    },
  });

  const name = useWatch({ control, name: "name" });
  const hasPrice = useWatch({ control, name: "hasPrice" });
  const managesStock = useWatch({ control, name: "managesStock" });

  useEffect(() => {
    if (name) {
      setValue("slug", createSlug(name), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [name, setValue]);

  useEffect(() => {
    async function loadFormData() {
      if (!params.id) {
        setLoadError("No se encontró el identificador del producto.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const [product, entrepreneurResponse, categoryData] = await Promise.all(
          [
            productService.getMyProductById(params.id),
            adminEntrepreneurService.listEntrepreneurs({
              page: 1,
              limit: 100,
              status: "approved",
            }),
            categoryService.listCategories({
              type: "product",
              isActive: "true",
            }),
          ],
        );

        setEntrepreneurs(entrepreneurResponse.items);
        setCategories(categoryData);

        reset({
          entrepreneurId: product.entrepreneurId ?? "",
          categoryId: product.categoryId ?? null,
          name: normalizeText(product.name),
          slug: normalizeText(product.slug),
          shortDescription: normalizeText(product.shortDescription),
          description: normalizeText(product.description),
          price: toNumberOrUndefined(product.price),
          hasPrice: product.hasPrice ?? true,
          stock: toNumberOrUndefined(product.stock),
          managesStock: product.managesStock ?? true,
        });
      } catch {
        setLoadError("No fue posible cargar el producto para edición.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadFormData();
  }, [params.id, reset]);

  async function onSubmit(values: ProductFormValues) {
    if (!params.id) {
      setSubmitError("No se encontró el identificador del producto.");
      return;
    }

    try {
      setSubmitError(null);

      await productService.updateMyProduct(params.id, {
        entrepreneurId: values.entrepreneurId,
        categoryId: values.categoryId || null,

        name: values.name,
        slug: values.slug,

        shortDescription: values.shortDescription || null,
        description: values.description || null,

        hasPrice: values.hasPrice,
        price: values.hasPrice ? (values.price ?? null) : null,

        managesStock: values.managesStock,
        stock: values.managesStock ? (values.stock ?? null) : null,
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
        description="Actualiza el producto asociado directamente a una emprendedora."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (params.id) {
                navigate(getProductDetailPath(params.id));
              } else {
                navigate(paths.admin.products);
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
                Emprendedora
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("entrepreneurId")}
              >
                <option value="">Selecciona una emprendedora</option>

                {entrepreneurs.map((entrepreneur) => (
                  <option key={entrepreneur.id} value={entrepreneur.id}>
                    {getEntrepreneurName(entrepreneur)}
                  </option>
                ))}
              </select>

              {errors.entrepreneurId?.message ? (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.entrepreneurId.message}
                </span>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Categoría
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("categoryId")}
              >
                <option value="">Sin categoría</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {errors.categoryId?.message ? (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.categoryId.message}
                </span>
              ) : null}
            </label>

            <Input
              label="Nombre del producto"
              placeholder="Ej: Bolso artesanal tejido"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Slug"
              placeholder="bolso-artesanal-tejido"
              error={errors.slug?.message}
              {...register("slug")}
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
              type="button"
              variant="secondary"
              onClick={() => {
                if (params.id) {
                  navigate(getProductDetailPath(params.id));
                } else {
                  navigate(paths.admin.products);
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

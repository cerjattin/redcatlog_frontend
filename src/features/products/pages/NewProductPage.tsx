import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { businessService } from "@/features/businesses/api/business.service";
import type { BusinessSummary } from "@/features/businesses/types/business.types";
import { productService } from "@/features/products/api/product.service";
import {
  createProductSchema,
  type CreateProductFormValues,
} from "@/features/products/schemas/createProduct.schema";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";
import { useNavigate } from "react-router-dom";
import { categoryService } from "@/features/admin/categories/api/category.service";
import type { Category } from "@/features/admin/categories/types/category.types";

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible crear el producto.";
  }

  return "No fue posible crear el producto.";
}

function getProductDetailPath(id: string) {
  return paths.entrepreneur.productDetail.replace(":id", id);
}

export function NewProductPage() {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      businessId: "",
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

  const name = watch("name");
  const hasPrice = watch("hasPrice");
  const managesStock = watch("managesStock");

  useEffect(() => {
    setValue("slug", createSlug(name));
  }, [name, setValue]);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [businessData, categoryData] = await Promise.all([
          businessService.listMyBusinesses(),
          categoryService.listCategories({
            type: "product",
            isActive: "true",
          }),
        ]);

        setBusinesses(businessData);
        setCategories(categoryData);
      } catch {
        setLoadError("No fue posible cargar tus emprendimientos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBusinesses();
  }, []);

  async function onSubmit(values: CreateProductFormValues) {
    try {
      setSubmitError(null);

      const product = await productService.createMyProduct({
        ...values,
        categoryId: values.categoryId || null,
        shortDescription: values.shortDescription || null,
        description: values.description || null,
        price: values.hasPrice ? (values.price ?? null) : null,
        stock: values.managesStock ? (values.stock ?? null) : null,
      });

      navigate(getProductDetailPath(product.id));
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
        eyebrow="Productos"
        title="Crear producto"
        description="Registra un nuevo producto asociado a uno de tus emprendimientos."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(paths.entrepreneur.products)}
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
                Emprendimiento
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("businessId")}
              >
                <option value="">Selecciona un emprendimiento</option>

                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>

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
                </select>
              </label>

              {errors.businessId?.message ? (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.businessId.message}
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
              variant="secondary"
              onClick={() => navigate(paths.entrepreneur.products)}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Crear producto
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

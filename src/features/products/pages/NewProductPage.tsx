import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { ImageFilePicker } from "@/components/forms/ImageFilePicker";
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
  createProductSchema,
  type CreateProductFormValues,
} from "@/features/products/schemas/createProduct.schema";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible crear el producto.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible crear el producto.";
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
    entrepreneur.firstName?.trim() ?? entrepreneur.user?.firstName?.trim() ?? "";

  const lastName =
    entrepreneur.lastName?.trim() ?? entrepreneur.user?.lastName?.trim() ?? "";

  const name = `${firstName} ${lastName}`.trim();

  return name || `Emprendedora #${entrepreneur.id}`;
}

export function NewProductPage() {
  const navigate = useNavigate();

  const [entrepreneurs, setEntrepreneurs] = useState<AdminEntrepreneur[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
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
    setValue("slug", createSlug(name));
  }, [name, setValue]);

  useEffect(() => {
    async function loadFormData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [entrepreneurData, categoryData] = await Promise.all([
          adminEntrepreneurService.listEntrepreneurs({
            page: 1,
            limit: 100,
            status: "approved",
          }),
          categoryService.listCategories({
            type: "product",
            isActive: "true",
          }),
        ]);

        setEntrepreneurs(entrepreneurData.items);
        setCategories(categoryData);
      } catch {
        setLoadError("No fue posible cargar emprendedoras y categorías.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadFormData();
  }, []);

  async function onSubmit(values: CreateProductFormValues) {
    let productWasCreated = Boolean(createdProductId);

    try {
      setSubmitError(null);

      let productId = createdProductId;

      if (!productId) {
        const product = await productService.createMyProduct({
          entrepreneurId: values.entrepreneurId,
          categoryId: values.categoryId || null,
          name: values.name,
          slug: values.slug,
          shortDescription: values.shortDescription || null,
          description: values.description || null,
          price: values.hasPrice ? (values.price ?? null) : null,
          hasPrice: values.hasPrice,
          stock: values.managesStock ? (values.stock ?? null) : null,
          managesStock: values.managesStock,
        });

        productId = product.id;
        productWasCreated = true;
        setCreatedProductId(product.id);
      }

      for (const file of imageFiles) {
        await productService.uploadProductImage(productId, file, {
          altText: values.name,
        });
        setImageFiles((current) => current.filter((item) => item !== file));
      }

      navigate(getProductDetailPath(productId));
    } catch (error) {
      setSubmitError(
        productWasCreated
          ? "El producto fue creado, pero no se cargaron todas las imágenes. Reintenta para completar el registro."
          : getApiErrorMessage(error),
      );
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
        description="Registra un producto de REDMUEMMA asociado directamente a una emprendedora."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(paths.admin.products)}
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

          <div className="mt-5">
            <ImageFilePicker
              label="Imágenes del producto"
              description="Selecciona hasta tres imágenes. Se cargarán junto con la creación del producto."
              files={imageFiles}
              onFilesChange={setImageFiles}
              maxFiles={3}
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
              onClick={() => navigate(paths.admin.products)}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {createdProductId ? "Reintentar imágenes" : "Crear producto"}
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

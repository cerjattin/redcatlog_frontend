import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  categorySchema,
  type CategoryFormValues,
} from "@/features/admin/categories/schemas/category.schema";
import type { Category } from "@/features/admin/categories/types/category.types";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";

function normalizeValue(value?: string | number | null) {
  return value ?? "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible guardar la categoría.";
  }

  return "No fue posible guardar la categoría.";
}

export function CategoryFormPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const isEditMode = Boolean(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      parentId: null,
      name: "",
      slug: "",
      description: "",
      iconUrl: "",
      type: "both",
      sortOrder: 1,
      isActive: true,
    },
  });

  const name = useWatch({ control, name: "name" });

  const parentOptions = useMemo(
    () => categories.filter((category) => category.id !== params.id),
    [categories, params.id],
  );

  useEffect(() => {
    if (!isEditMode) {
      setValue("slug", createSlug(name));
    }
  }, [name, isEditMode, setValue]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const categoryList = await categoryService.listCategories();

        setCategories(categoryList);

        if (params.id) {
          const category = await categoryService.getCategoryById(params.id);

          reset({
            parentId: category.parentId,
            name: category.name,
            slug: category.slug,
            description: normalizeValue(category.description) as string,
            iconUrl: normalizeValue(category.iconUrl) as string,
            type: category.type,
            sortOrder: category.sortOrder,
            isActive: category.isActive,
          });
        }
      } catch {
        setLoadError("No fue posible cargar la información de la categoría.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [params.id, reset]);

  async function onSubmit(values: CategoryFormValues) {
    try {
      setSubmitError(null);

      const payload = {
        ...values,
        parentId: values.parentId || null,
        description: values.description || null,
        iconUrl: values.iconUrl || null,
      };

      if (params.id) {
        await categoryService.updateCategory(params.id, payload);
      } else {
        await categoryService.createCategory(payload);
      }

      navigate(paths.admin.categories);
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
        eyebrow="Categorías"
        title={isEditMode ? "Editar categoría" : "Nueva categoría"}
        description="Gestiona categorías para productos, emprendimientos o ambos."
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(paths.admin.categories)}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Nombre"
              placeholder="Ej: Artesanías"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Slug"
              placeholder="artesanias"
              error={errors.slug?.message}
              {...register("slug")}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Categoría padre
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("parentId")}
              >
                <option value="">Sin padre / Principal</option>

                {parentOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700">
                Tipo
              </span>

              <select
                className="h-11 w-full rounded-xl border border-ink-100 bg-white px-4 text-sm text-ink-900 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                {...register("type")}
              >
                <option value="both">Ambos</option>
                <option value="business">Emprendimiento</option>
                <option value="product">Producto</option>
              </select>
            </label>

            <Input
              label="Orden"
              type="number"
              placeholder="1"
              error={errors.sortOrder?.message}
              {...register("sortOrder", {
                setValueAs: (value) =>
                  value === "" || value === null || value === undefined
                    ? undefined
                    : Number(value),
              })}
            />

            <Input
              label="Icon URL"
              placeholder="/uploads/categories/icon.png"
              error={errors.iconUrl?.message}
              {...register("iconUrl")}
            />

            <label className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-300 text-primary-600"
                {...register("isActive")}
              />
              Categoría activa
            </label>
          </div>

          <div className="mt-5">
            <Textarea
              label="Descripción"
              placeholder="Describe brevemente esta categoría..."
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
              onClick={() => navigate(paths.admin.categories)}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Guardar categoría
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

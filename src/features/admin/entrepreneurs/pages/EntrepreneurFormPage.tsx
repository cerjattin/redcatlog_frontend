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
import {
  entrepreneurSchema,
  type EntrepreneurFormValues,
} from "@/features/admin/entrepreneurs/schemas/entrepreneur.schema";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";

function normalizeText(value?: string | number | null) {
  return value === null || value === undefined ? "" : String(value);
}

function nullable(value?: string | null) {
  return value && value.trim() ? value.trim() : null;
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible guardar la emprendedora.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible guardar la emprendedora.";
}

function getEntrepreneurDetailPath(id: string) {
  return paths.admin.entrepreneurDetail.replace(":id", id);
}

export function EntrepreneurFormPage() {
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
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EntrepreneurFormValues>({
    resolver: zodResolver(entrepreneurSchema),
    defaultValues: {
      categoryId: null,
      firstName: "",
      lastName: "",
      fullName: "",
      slug: "",
      documentType: "",
      documentNumber: "",
      shortBio: "",
      bio: "",
      personalStory: "",
      locationText: "",
      photoUrl: "",
      bannerUrl: "",
      email: "",
      phone: "",
      whatsapp: "",
      city: "",
      department: "",
      country: "Colombia",
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
      websiteUrl: "",
    },
  });

  const firstName = useWatch({ control, name: "firstName" });
  const lastName = useWatch({ control, name: "lastName" });

  useEffect(() => {
    const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    if (name) {
      setValue("fullName", name, {
        shouldDirty: true,
        shouldValidate: false,
      });

      setValue("slug", createSlug(name), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [firstName, lastName, setValue]);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const [categoryData, entrepreneur] = await Promise.all([
          categoryService.listCategories({
            type: "entrepreneur",
            isActive: "true",
          }),
          params.id
            ? adminEntrepreneurService.getEntrepreneurById(params.id)
            : Promise.resolve(null),
        ]);

        setCategories(categoryData);

        if (entrepreneur) {
          reset({
            categoryId: entrepreneur.categoryId ?? null,
            firstName: normalizeText(
              entrepreneur.firstName ?? entrepreneur.user?.firstName,
            ),
            lastName: normalizeText(
              entrepreneur.lastName ?? entrepreneur.user?.lastName,
            ),
            fullName: normalizeText(entrepreneur.fullName),
            slug: normalizeText(entrepreneur.slug),
            documentType: normalizeText(entrepreneur.documentType),
            documentNumber: normalizeText(entrepreneur.documentNumber),
            shortBio: normalizeText(entrepreneur.shortBio),
            bio: normalizeText(entrepreneur.bio),
            personalStory: normalizeText(entrepreneur.personalStory),
            locationText: normalizeText(entrepreneur.locationText),
            photoUrl: normalizeText(
              entrepreneur.photoUrl ?? entrepreneur.profilePhotoUrl,
            ),
            bannerUrl: normalizeText(entrepreneur.bannerUrl),
            email: normalizeText(
              entrepreneur.email ?? entrepreneur.user?.email,
            ),
            phone: normalizeText(
              entrepreneur.phone ?? entrepreneur.user?.phone,
            ),
            whatsapp: normalizeText(
              entrepreneur.whatsapp ?? entrepreneur.user?.whatsapp,
            ),
            city: normalizeText(entrepreneur.city ?? entrepreneur.user?.city),
            department: normalizeText(
              entrepreneur.department ?? entrepreneur.user?.department,
            ),
            country: normalizeText(entrepreneur.country ?? "Colombia"),
            facebookUrl: normalizeText(entrepreneur.facebookUrl),
            instagramUrl: normalizeText(entrepreneur.instagramUrl),
            tiktokUrl: normalizeText(entrepreneur.tiktokUrl),
            youtubeUrl: normalizeText(entrepreneur.youtubeUrl),
            websiteUrl: normalizeText(entrepreneur.websiteUrl),
          });
        }
      } catch {
        setLoadError("No fue posible cargar el formulario de emprendedora.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, [params.id, reset]);

  async function onSubmit(values: EntrepreneurFormValues) {
    try {
      setSubmitError(null);

      const payload = {
        categoryId: values.categoryId || null,

        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        fullName: nullable(values.fullName),
        slug: values.slug.trim(),

        documentType: nullable(values.documentType),
        documentNumber: nullable(values.documentNumber),

        shortBio: nullable(values.shortBio),
        bio: nullable(values.bio),
        personalStory: nullable(values.personalStory),
        locationText: nullable(values.locationText),

        photoUrl: nullable(values.photoUrl),
        bannerUrl: nullable(values.bannerUrl),

        email: nullable(values.email),
        phone: nullable(values.phone),
        whatsapp: nullable(values.whatsapp),

        city: nullable(values.city),
        department: nullable(values.department),
        country: nullable(values.country) ?? "Colombia",

        facebookUrl: nullable(values.facebookUrl),
        instagramUrl: nullable(values.instagramUrl),
        tiktokUrl: nullable(values.tiktokUrl),
        youtubeUrl: nullable(values.youtubeUrl),
        websiteUrl: nullable(values.websiteUrl),
      };

      const entrepreneur = params.id
        ? await adminEntrepreneurService.updateEntrepreneur(params.id, payload)
        : await adminEntrepreneurService.createEntrepreneur({
            ...payload,
            status: "pending_review",
          });

      navigate(getEntrepreneurDetailPath(entrepreneur.id));
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
        eyebrow="Emprendedoras"
        title={isEditMode ? "Editar emprendedora" : "Crear emprendedora"}
        description="Gestiona información personal, categoría, contacto, WhatsApp y redes sociales."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(paths.admin.entrepreneurs)}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          <Card>
            <h2 className="text-lg font-bold text-ink-900">
              Información principal
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Nombre"
                error={errors.firstName?.message}
                {...register("firstName")}
              />

              <Input
                label="Apellido"
                error={errors.lastName?.message}
                {...register("lastName")}
              />

              <Input
                label="Nombre público"
                error={errors.fullName?.message}
                {...register("fullName")}
              />

              <Input
                label="Slug"
                error={errors.slug?.message}
                {...register("slug")}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-ink-700">
                  Categoría principal
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
                label="Documento"
                error={errors.documentNumber?.message}
                {...register("documentNumber")}
              />

              <Input
                label="Tipo de documento"
                placeholder="CC, CE, TI..."
                error={errors.documentType?.message}
                {...register("documentType")}
              />

              <Input
                label="País"
                error={errors.country?.message}
                {...register("country")}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Contacto</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Correo"
                type="email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Teléfono"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="WhatsApp"
                error={errors.whatsapp?.message}
                {...register("whatsapp")}
              />

              <Input
                label="Ciudad"
                error={errors.city?.message}
                {...register("city")}
              />

              <Input
                label="Departamento"
                error={errors.department?.message}
                {...register("department")}
              />

              <Input
                label="Ubicación textual"
                error={errors.locationText?.message}
                {...register("locationText")}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Imágenes</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="URL de foto/perfil"
                error={errors.photoUrl?.message}
                {...register("photoUrl")}
              />

              <Input
                label="URL de banner"
                error={errors.bannerUrl?.message}
                {...register("bannerUrl")}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Historia</h2>

            <div className="mt-5 grid gap-5">
              <Textarea
                label="Biografía corta"
                error={errors.shortBio?.message}
                {...register("shortBio")}
              />

              <Textarea
                label="Biografía"
                error={errors.bio?.message}
                {...register("bio")}
              />

              <Textarea
                label="Historia personal"
                error={errors.personalStory?.message}
                {...register("personalStory")}
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-ink-900">Redes sociales</h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Input
                label="Facebook"
                error={errors.facebookUrl?.message}
                {...register("facebookUrl")}
              />

              <Input
                label="Instagram"
                error={errors.instagramUrl?.message}
                {...register("instagramUrl")}
              />

              <Input
                label="TikTok"
                error={errors.tiktokUrl?.message}
                {...register("tiktokUrl")}
              />

              <Input
                label="YouTube"
                error={errors.youtubeUrl?.message}
                {...register("youtubeUrl")}
              />

              <Input
                label="Sitio web"
                error={errors.websiteUrl?.message}
                {...register("websiteUrl")}
              />
            </div>
          </Card>

          {submitError ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {submitError}
            </div>
          ) : null}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(paths.admin.entrepreneurs)}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Guardar emprendedora
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

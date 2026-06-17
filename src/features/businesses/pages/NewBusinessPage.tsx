import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ImagePlus, Save, Store, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { businessService } from "@/features/businesses/api/business.service";
import {
  businessSchema,
  type BusinessFormValues,
} from "@/features/businesses/schemas/business.schema";
import { entrepreneurService } from "@/features/entrepreneurs/api/entrepreneur.service";
import type { EntrepreneurProfile } from "@/features/entrepreneurs/types/entrepreneur.types";
import { paths } from "@/routes/paths";
import { createSlug } from "@/utils/slug";

type ImageUploadFieldProps = {
  title: string;
  description: string;
  previewUrl: string | null;
  emptyText: string;
  imageClassName: string;
  onChange: (file: File | null) => void;
};

function ImageUploadField({
  title,
  description,
  previewUrl,
  emptyText,
  imageClassName,
  onChange,
}: ImageUploadFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    onChange(file);
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-ink-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ImagePlus className="h-5 w-5 text-primary-600" />

        <h2 className="text-sm font-bold text-ink-900">{title}</h2>
      </div>

      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
        {previewUrl ? (
          <img src={previewUrl} alt={title} className={imageClassName} />
        ) : (
          <div className="flex h-40 items-center justify-center px-4 text-center text-sm text-ink-400">
            {emptyText}
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="mt-4 block w-full text-sm text-ink-500 file:mr-4 file:rounded-xl file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
        onChange={handleChange}
      />

      <p className="mt-2 text-xs leading-5 text-ink-400">{description}</p>
    </div>
  );
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible crear el emprendimiento.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible crear el emprendimiento.";
}

function getBusinessDetailPath(id: string) {
  return paths.entrepreneur.businessDetail.replace(":id", id);
}

function getProfileStatusMessage(profile: EntrepreneurProfile | null) {
  if (!profile) {
    return {
      title: "Primero debes crear tu perfil de emprendedora",
      description:
        "Antes de registrar un emprendimiento, debes crear tu perfil de emprendedora y enviarlo a revisión.",
      actionLabel: "Crear mi perfil de emprendedora",
      actionPath: paths.entrepreneur.editProfile,
    };
  }

  if (profile.status === "pending_review") {
    return {
      title: "Tu perfil está pendiente de aprobación",
      description:
        "Tu perfil fue enviado a revisión. Un administrador debe aprobarlo antes de que puedas crear emprendimientos.",
      actionLabel: "Ver mi perfil",
      actionPath: paths.entrepreneur.profile,
    };
  }

  if (profile.status === "draft") {
    return {
      title: "Completa tu perfil de emprendedora",
      description:
        "Tu perfil aún está en borrador. Completa la información requerida antes de crear emprendimientos.",
      actionLabel: "Completar perfil",
      actionPath: paths.entrepreneur.editProfile,
    };
  }

  if (profile.status === "rejected") {
    return {
      title: "Tu perfil fue rechazado",
      description:
        "Revisa la información de tu perfil y completa los ajustes necesarios antes de intentar crear un emprendimiento.",
      actionLabel: "Editar perfil",
      actionPath: paths.entrepreneur.editProfile,
    };
  }

  if (profile.status === "inactive") {
    return {
      title: "Tu perfil está inactivo",
      description:
        "No puedes crear emprendimientos mientras tu perfil se encuentre inactivo. Contacta al administrador.",
      actionLabel: "Ver mi perfil",
      actionPath: paths.entrepreneur.profile,
    };
  }

  return null;
}

export function NewBusinessPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      mainCategoryId: "",
      name: "",
      shortDescription: "",
      description: "",
      story: "",
      logoUrl: "",
      bannerUrl: "",
      contactEmail: "",
      contactPhone: "",
      contactWhatsapp: "",
      city: "",
      department: "",
      country: "Colombia",
      addressText: "",
      facebookUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      websiteUrl: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const data = await entrepreneurService.getMyProfile();

        setProfile(data);
      } catch {
        setLoadError("No fue posible validar tu perfil de emprendedora.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  function handleLogoChange(file: File | null) {
    setLogoFile(file);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleBannerChange(file: File | null) {
    setBannerFile(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(values: BusinessFormValues) {
    try {
      setSubmitError(null);

      let logoUrl: string | null = null;
      let bannerUrl: string | null = null;

      if (logoFile) {
        const uploadedLogo = await businessService.uploadBusinessImage(
          logoFile,
          {
            title: `Logo de ${values.name}`,
            altText: `Logo del emprendimiento ${values.name}`,
          },
        );

        logoUrl = uploadedLogo.fileUrl;
      }

      if (bannerFile) {
        const uploadedBanner = await businessService.uploadBusinessImage(
          bannerFile,
          {
            title: `Banner de ${values.name}`,
            altText: `Banner del emprendimiento ${values.name}`,
          },
        );

        bannerUrl = uploadedBanner.fileUrl;
      }

      const business = await businessService.createMyBusiness({
        mainCategoryId: values.mainCategoryId || null,
        name: values.name,
        slug: createSlug(values.name),
        shortDescription: values.shortDescription || null,
        description: values.description || null,
        story: values.story || null,
        logoUrl,
        bannerUrl,
        contactEmail: values.contactEmail || null,
        contactPhone: values.contactPhone || null,
        contactWhatsapp: values.contactWhatsapp || null,
        city: values.city || null,
        department: values.department || null,
        country: values.country || "Colombia",
        addressText: values.addressText || null,
        facebookUrl: values.facebookUrl || null,
        instagramUrl: values.instagramUrl || null,
        tiktokUrl: values.tiktokUrl || null,
        websiteUrl: values.websiteUrl || null,
      });

      navigate(getBusinessDetailPath(business.id));
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  }

  if (isLoading) {
    return <Loader label="Validando perfil..." />;
  }

  if (loadError) {
    return (
      <EmptyState
        title="No se pudo validar tu perfil"
        description={loadError}
      />
    );
  }

  const statusMessage = getProfileStatusMessage(profile);

  if (statusMessage) {
    return (
      <section>
        <PageHeader
          eyebrow="Emprendimientos"
          title="Crear emprendimiento"
          description="Para crear un emprendimiento primero debes tener un perfil de emprendedora aprobado."
        />

        <EmptyState
          icon={<UserRoundCheck className="h-6 w-6" />}
          title={statusMessage.title}
          description={statusMessage.description}
          actionLabel={statusMessage.actionLabel}
          onAction={() => navigate(statusMessage.actionPath)}
        />
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimientos"
        title="Crear emprendimiento"
        description="Registra la información principal de tu emprendimiento. Después será revisado por un administrador."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(paths.entrepreneur.businesses)}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="mb-5 flex gap-3 rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium leading-6 text-primary-700">
            <Store className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Al crear tu emprendimiento quedará registrado para revisión. Un
              administrador deberá aprobarlo antes de que puedas crear productos
              asociados.
            </p>
          </div>

          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <ImageUploadField
              title="Banner del emprendimiento"
              description="Recomendado: JPG o WEBP, relación 16:9 o 3:1, máximo 3 MB."
              previewUrl={bannerPreview}
              emptyText="Sin banner seleccionado"
              imageClassName="h-40 w-full object-cover"
              onChange={handleBannerChange}
            />

            <ImageUploadField
              title="Logo del emprendimiento"
              description="Recomendado: PNG o WEBP, relación 1:1, máximo 3 MB."
              previewUrl={logoPreview}
              emptyText="Sin logo seleccionado"
              imageClassName="h-40 w-full object-contain p-4"
              onChange={handleLogoChange}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="ID categoría principal"
              placeholder="Ej: 1"
              error={errors.mainCategoryId?.message}
              {...register("mainCategoryId")}
            />

            <Input
              label="Nombre del emprendimiento"
              placeholder="Ej: Artesanías María"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Correo de contacto"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.contactEmail?.message}
              {...register("contactEmail")}
            />

            <Input
              label="Teléfono de contacto"
              placeholder="3000000000"
              error={errors.contactPhone?.message}
              {...register("contactPhone")}
            />

            <Input
              label="WhatsApp de contacto"
              placeholder="573001234567"
              error={errors.contactWhatsapp?.message}
              {...register("contactWhatsapp")}
            />

            <Input
              label="Ciudad"
              placeholder="Barranquilla"
              error={errors.city?.message}
              {...register("city")}
            />

            <Input
              label="Departamento"
              placeholder="Atlántico"
              error={errors.department?.message}
              {...register("department")}
            />

            <Input
              label="País"
              placeholder="Colombia"
              error={errors.country?.message}
              {...register("country")}
            />

            <Input
              label="Dirección o referencia"
              placeholder="Barranquilla, Atlántico"
              error={errors.addressText?.message}
              {...register("addressText")}
            />

            <Input
              label="Facebook"
              placeholder="https://facebook.com/tuemprendimiento"
              error={errors.facebookUrl?.message}
              {...register("facebookUrl")}
            />

            <Input
              label="Instagram"
              placeholder="https://instagram.com/tuemprendimiento"
              error={errors.instagramUrl?.message}
              {...register("instagramUrl")}
            />

            <Input
              label="TikTok"
              placeholder="https://tiktok.com/@tuemprendimiento"
              error={errors.tiktokUrl?.message}
              {...register("tiktokUrl")}
            />

            <Input
              label="Sitio web"
              placeholder="https://tuemprendimiento.com"
              error={errors.websiteUrl?.message}
              {...register("websiteUrl")}
            />
          </div>

          <div className="mt-5 grid gap-5">
            <Textarea
              label="Descripción corta"
              placeholder="Resumen breve del emprendimiento..."
              error={errors.shortDescription?.message}
              {...register("shortDescription")}
            />

            <Textarea
              label="Descripción completa"
              placeholder="Describe el origen, productos, propósito y valor diferencial del emprendimiento..."
              error={errors.description?.message}
              {...register("description")}
            />

            <Textarea
              label="Historia del emprendimiento"
              placeholder="Cuenta la historia, propósito o inspiración detrás del emprendimiento..."
              error={errors.story?.message}
              {...register("story")}
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
              onClick={() => navigate(paths.entrepreneur.businesses)}
            >
              Cancelar
            </Button>

            <Button type="submit" isLoading={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Crear emprendimiento
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

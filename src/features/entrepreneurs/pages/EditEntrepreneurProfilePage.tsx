import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Save, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { entrepreneurService } from "@/features/entrepreneurs/api/entrepreneur.service";
import {
  entrepreneurProfileSchema,
  type EntrepreneurProfileFormValues,
} from "@/features/entrepreneurs/schemas/entrepreneurProfile.schema";
import { paths } from "@/routes/paths";

function normalizeValue(value?: string | null) {
  return value ?? "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible guardar el perfil.";
  }

  return "No fue posible guardar el perfil.";
}

export function EditEntrepreneurProfilePage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntrepreneurProfileFormValues>({
    resolver: zodResolver(entrepreneurProfileSchema),
    defaultValues: {
      documentType: "",
      documentNumber: "",
      personalStory: "",
      shortBio: "",
      locationText: "",
      city: "",
      department: "",
      country: "Colombia",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const profile = await entrepreneurService.getMyProfile();

        if (!profile) {
          setIsCreateMode(true);
          setProfileStatus(null);

          reset({
            documentType: "",
            documentNumber: "",
            personalStory: "",
            shortBio: "",
            locationText: "",
            city: "",
            department: "",
            country: "Colombia",
          });

          return;
        }

        setIsCreateMode(false);
        setProfileStatus(profile.status);

        reset({
          documentType: normalizeValue(profile.documentType),
          documentNumber: normalizeValue(profile.documentNumber),
          personalStory: normalizeValue(profile.personalStory),
          shortBio: normalizeValue(profile.shortBio),
          locationText: normalizeValue(profile.locationText),
          city: normalizeValue(profile.city ?? profile.user?.city),
          department: normalizeValue(
            profile.department ?? profile.user?.department,
          ),
          country: normalizeValue(profile.country ?? "Colombia"),
        });
      } catch {
        setLoadError("No fue posible cargar el perfil para edición.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [reset]);

  async function onSubmit(values: EntrepreneurProfileFormValues) {
    if (!isCreateMode && profileStatus === "approved") {
      setSubmitError(
        "El perfil aprobado no puede editarse directamente en esta versión.",
      );
      return;
    }

    try {
      setSubmitError(null);

      if (isCreateMode) {
        await entrepreneurService.createMyProfile(values);
      } else {
        await entrepreneurService.updateMyProfile(values);
      }

      navigate(paths.entrepreneur.profile);
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

  const isApprovedProfile = !isCreateMode && profileStatus === "approved";

  return (
    <section>
      <PageHeader
        eyebrow="Mi perfil"
        title={
          isCreateMode
            ? "Crear perfil de emprendedora"
            : "Editar perfil de emprendedora"
        }
        description={
          isCreateMode
            ? "Completa tu información para crear tu perfil. Será enviado a revisión por un administrador."
            : "Actualiza tu información de identificación, ubicación, historia y biografía."
        }
        actions={
          <Button
            variant="secondary"
            onClick={() => navigate(paths.entrepreneur.profile)}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {isCreateMode ? (
            <div className="mb-5 flex gap-3 rounded-xl bg-primary-50 px-4 py-3 text-sm font-medium leading-6 text-primary-700">
              <UserRoundPlus className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Al crear tu perfil, quedará enviado a revisión. Un administrador
                deberá aprobarlo antes de que puedas crear emprendimientos.
              </p>
            </div>
          ) : null}

          {isApprovedProfile ? (
            <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              Este perfil ya fue aprobado. En esta versión no puede editarse
              directamente.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Tipo de documento"
              placeholder="CC, CE, TI..."
              disabled={isApprovedProfile}
              error={errors.documentType?.message}
              {...register("documentType")}
            />

            <Input
              label="Número de documento"
              placeholder="Número de identificación"
              disabled={isApprovedProfile}
              error={errors.documentNumber?.message}
              {...register("documentNumber")}
            />

            <Input
              label="Ciudad"
              placeholder="Barranquilla"
              disabled={isApprovedProfile}
              error={errors.city?.message}
              {...register("city")}
            />

            <Input
              label="Departamento"
              placeholder="Atlántico"
              disabled={isApprovedProfile}
              error={errors.department?.message}
              {...register("department")}
            />

            <Input
              label="País"
              placeholder="Colombia"
              disabled={isApprovedProfile}
              error={errors.country?.message}
              {...register("country")}
            />

            <Input
              label="Ubicación textual"
              placeholder="Barrio, corregimiento o referencia"
              disabled={isApprovedProfile}
              error={errors.locationText?.message}
              {...register("locationText")}
            />
          </div>

          <div className="mt-5 grid gap-5">
            <Textarea
              label="Historia personal"
              placeholder="Cuenta brevemente tu historia y el origen de tu emprendimiento..."
              disabled={isApprovedProfile}
              error={errors.personalStory?.message}
              {...register("personalStory")}
            />

            <Textarea
              label="Biografía corta"
              placeholder="Una descripción corta para tu perfil público..."
              disabled={isApprovedProfile}
              error={errors.shortBio?.message}
              {...register("shortBio")}
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
              onClick={() => navigate(paths.entrepreneur.profile)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isApprovedProfile}
            >
              <Save className="mr-2 h-4 w-4" />
              {isCreateMode ? "Crear perfil" : "Guardar cambios"}
            </Button>
          </div>
        </Card>
      </form>
    </section>
  );
}

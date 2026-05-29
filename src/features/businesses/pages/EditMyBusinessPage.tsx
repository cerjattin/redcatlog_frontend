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
import { businessService } from "@/features/businesses/api/business.service";
import {
  businessSchema,
  type BusinessFormValues,
} from "@/features/businesses/schemas/business.schema";
import { paths } from "@/routes/paths";

function normalizeValue(value?: string | null) {
  return value ?? "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string } | undefined;

    return data?.message ?? "No fue posible actualizar el emprendimiento.";
  }

  return "No fue posible actualizar el emprendimiento.";
}

function getBusinessDetailPath(id: string) {
  return paths.entrepreneur.businessDetail.replace(":id", id);
}

export function EditMyBusinessPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [businessStatus, setBusinessStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      city: "",
      department: "",
      country: "Colombia",
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
    },
  });

  useEffect(() => {
    async function loadBusiness() {
      if (!params.id) {
        setLoadError("No se encontró el identificador del emprendimiento.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const business = await businessService.getMyBusinessById(params.id);

        setBusinessStatus(business.status);

        reset({
          name: normalizeValue(business.name),
          shortDescription: normalizeValue(business.shortDescription),
          description: normalizeValue(business.description),
          city: normalizeValue(business.city),
          department: normalizeValue(business.department),
          country: normalizeValue(business.country ?? "Colombia"),
          phone: normalizeValue(business.phone),
          whatsapp: normalizeValue(business.whatsapp),
          email: normalizeValue(business.email),
          address: normalizeValue(business.address),
        });
      } catch {
        setLoadError("No fue posible cargar el emprendimiento para edición.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBusiness();
  }, [params.id, reset]);

  async function onSubmit(values: BusinessFormValues) {
    if (!params.id) {
      setSubmitError("No se encontró el identificador del emprendimiento.");
      return;
    }

    try {
      setSubmitError(null);

      await businessService.updateMyBusiness(params.id, values);

      navigate(getBusinessDetailPath(params.id));
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

  const isApprovedOrPublished =
    businessStatus === "approved" || businessStatus === "published";

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimiento"
        title="Editar emprendimiento"
        description="Actualiza la información visible de tu emprendimiento."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              if (params.id) {
                navigate(getBusinessDetailPath(params.id));
              } else {
                navigate(paths.entrepreneur.businesses);
              }
            }}
          >
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          {isApprovedOrPublished ? (
            <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              Este emprendimiento ya está aprobado o publicado. Solo modifica
              información de contacto y descripción si el backend lo permite.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Nombre del emprendimiento"
              placeholder="Nombre comercial"
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              label="Correo"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
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
              label="Dirección"
              placeholder="Dirección o referencia"
              error={errors.address?.message}
              {...register("address")}
            />

            <Input
              label="Teléfono"
              placeholder="3000000000"
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input
              label="WhatsApp"
              placeholder="3000000000"
              error={errors.whatsapp?.message}
              {...register("whatsapp")}
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
                  navigate(getBusinessDetailPath(params.id));
                } else {
                  navigate(paths.entrepreneur.businesses);
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

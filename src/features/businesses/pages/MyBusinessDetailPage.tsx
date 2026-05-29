import { ArrowLeft, Package, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { businessService } from "@/features/businesses/api/business.service";
import type { BusinessDetail } from "@/features/businesses/types/business.types";
import { paths } from "@/routes/paths";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente",
    approved: "Aprobado",
    published: "Publicado",
    rejected: "Rechazado",
    inactive: "Inactivo",
    archived: "Archivado",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "approved" || status === "published") {
    return "success";
  }

  if (status === "pending_review") {
    return "warning";
  }

  if (status === "rejected" || status === "inactive" || status === "archived") {
    return "danger";
  }

  return "neutral";
}

function getBusinessEditPath(id: string) {
  return paths.entrepreneur.editBusiness.replace(":id", id);
}

export function MyBusinessDetailPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusiness() {
      if (!params.id) {
        setError("No se encontró el identificador del emprendimiento.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const data = await businessService.getMyBusinessById(params.id);

        setBusiness(data);
      } catch {
        setError("No fue posible cargar el detalle del emprendimiento.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBusiness();
  }, [params.id]);

  if (isLoading) {
    return <Loader label="Cargando emprendimiento..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar el emprendimiento"
        description={error}
      />
    );
  }

  if (!business) {
    return (
      <EmptyState
        title="Emprendimiento no encontrado"
        description="No encontramos información para este emprendimiento."
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimiento"
        title={business.name}
        description={
          business.shortDescription ??
          business.description ??
          "Detalle del emprendimiento registrado."
        }
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(paths.entrepreneur.businesses)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button onClick={() => navigate(getBusinessEditPath(business.id))}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-ink-900">
                Información general
              </h2>

              <p className="mt-1 text-sm text-ink-500">/{business.slug}</p>
            </div>

            <Badge variant={getStatusVariant(business.status)}>
              {getStatusLabel(business.status)}
            </Badge>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.city ?? "No registrada"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.department ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                País
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.country ?? "Colombia"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                WhatsApp
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.whatsapp ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.phone ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Correo
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {business.email ?? "No registrado"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Contenido visual</h2>

          <div className="mt-5 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
              {business.coverImageUrl ? (
                <img
                  src={business.coverImageUrl}
                  alt={`Portada de ${business.name}`}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-sm text-ink-400">
                  Sin imagen de portada
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-50">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={`Logo de ${business.name}`}
                  className="h-28 w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-28 items-center justify-center text-sm text-ink-400">
                  Sin logo registrado
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Descripción</h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {business.description ?? "No hay descripción registrada."}
        </p>
      </Card>

      {business.rejectionReason ? (
        <Card className="mt-4 border-red-100 bg-red-50">
          <h2 className="text-lg font-bold text-red-800">Motivo de rechazo</h2>

          <p className="mt-3 text-sm leading-7 text-red-700">
            {business.rejectionReason}
          </p>
        </Card>
      ) : null}

      <Card className="mt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Package className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-ink-900">
              Productos del emprendimiento
            </h2>

            <p className="text-sm text-ink-500">
              En la siguiente fase conectaremos los productos asociados.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

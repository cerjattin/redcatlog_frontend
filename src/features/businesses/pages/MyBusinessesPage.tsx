import { Eye, Plus, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { businessService } from "@/features/businesses/api/business.service";
import type { BusinessSummary } from "@/features/businesses/types/business.types";
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

function getBusinessDetailPath(id: string) {
  return paths.entrepreneur.businessDetail.replace(":id", id);
}

export function MyBusinessesPage() {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await businessService.listMyBusinesses();

        setBusinesses(data);
      } catch {
        setError("No fue posible cargar tus emprendimientos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBusinesses();
  }, []);

  if (isLoading) {
    return <Loader label="Cargando emprendimientos..." />;
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los emprendimientos"
        description={error}
      />
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimientos"
        title="Mis emprendimientos"
        description="Consulta y administra los emprendimientos asociados a tu perfil."
        actions={
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo emprendimiento
          </Button>
        }
      />

      {businesses.length === 0 ? (
        <EmptyState
          icon={<Store className="h-6 w-6" />}
          title="Aún no tienes emprendimientos"
          description="Cuando el backend permita creación desde el panel, podrás registrar tu primer emprendimiento aquí."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => navigate(getBusinessDetailPath(business.id))}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-ink-900">
                    {business.name}
                  </h2>

                  <p className="mt-1 text-xs text-ink-500">/{business.slug}</p>
                </div>

                <Badge variant={getStatusVariant(business.status)}>
                  {getStatusLabel(business.status)}
                </Badge>
              </div>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink-500">
                {business.shortDescription ??
                  business.description ??
                  "Sin descripción registrada."}
              </p>

              <div className="mt-5 border-t border-ink-100 pt-4 text-sm text-ink-500">
                <p>
                  {business.city ?? "Ciudad no registrada"}
                  {business.department ? `, ${business.department}` : ""}
                </p>

                <p className="mt-1">
                  WhatsApp: {business.whatsapp ?? "No registrado"}
                </p>
              </div>

              <div className="mt-5">
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(getBusinessDetailPath(business.id));
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

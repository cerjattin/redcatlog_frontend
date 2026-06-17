import { Eye, Plus, Store, UserRoundCheck } from "lucide-react";
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
import { entrepreneurService } from "@/features/entrepreneurs/api/entrepreneur.service";
import type { EntrepreneurProfile } from "@/features/entrepreneurs/types/entrepreneur.types";
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

function getProfileBlockMessage(profile: EntrepreneurProfile | null) {
  if (!profile) {
    return {
      title: "Primero debes crear tu perfil de emprendedora",
      description:
        "Antes de registrar un emprendimiento, crea tu perfil de emprendedora y envíalo a revisión.",
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
        "Tu perfil aún está en borrador. Completa la información antes de crear emprendimientos.",
      actionLabel: "Completar perfil",
      actionPath: paths.entrepreneur.editProfile,
    };
  }

  if (profile.status === "rejected") {
    return {
      title: "Tu perfil fue rechazado",
      description:
        "Revisa y completa la información de tu perfil antes de crear emprendimientos.",
      actionLabel: "Editar perfil",
      actionPath: paths.entrepreneur.editProfile,
    };
  }

  if (profile.status === "inactive") {
    return {
      title: "Tu perfil está inactivo",
      description:
        "No puedes crear emprendimientos mientras tu perfil esté inactivo.",
      actionLabel: "Ver mi perfil",
      actionPath: paths.entrepreneur.profile,
    };
  }

  return null;
}

export function MyBusinessesPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);

      const profileData = await entrepreneurService.getMyProfile();

      setProfile(profileData);

      if (profileData?.status === "approved") {
        const businessData = await businessService.listMyBusinesses();

        setBusinesses(businessData);
      } else {
        setBusinesses([]);
      }
    } catch {
      setError("No fue posible cargar la información de tus emprendimientos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
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

  const profileBlockMessage = getProfileBlockMessage(profile);
  const canCreateBusiness = profile?.status === "approved";

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimientos"
        title="Mis emprendimientos"
        description="Consulta y administra los emprendimientos asociados a tu perfil."
        actions={
          canCreateBusiness ? (
            <Button onClick={() => navigate(paths.entrepreneur.newBusiness)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo emprendimiento
            </Button>
          ) : undefined
        }
      />

      {profileBlockMessage ? (
        <EmptyState
          icon={<UserRoundCheck className="h-6 w-6" />}
          title={profileBlockMessage.title}
          description={profileBlockMessage.description}
          actionLabel={profileBlockMessage.actionLabel}
          onAction={() => navigate(profileBlockMessage.actionPath)}
        />
      ) : businesses.length === 0 ? (
        <EmptyState
          icon={<Store className="h-6 w-6" />}
          title="Aún no tienes emprendimientos"
          description="Registra tu primer emprendimiento. Quedará pendiente de revisión por un administrador."
          actionLabel="Crear emprendimiento"
          onAction={() => navigate(paths.entrepreneur.newBusiness)}
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

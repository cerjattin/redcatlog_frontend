import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/feedback/EmptyState";
import { Loader } from "@/components/feedback/Loader";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { entrepreneurService } from "@/features/entrepreneurs/api/entrepreneur.service";
import type { EntrepreneurProfile } from "@/features/entrepreneurs/types/entrepreneur.types";
import { paths } from "@/routes/paths";

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: "Borrador",
    pending_review: "Pendiente de revisión",
    approved: "Aprobado",
    rejected: "Rechazado",
    inactive: "Inactivo",
    published: "Publicado",
  };

  return labels[status] ?? status;
}

function getStatusVariant(status: string) {
  if (status === "approved" || status === "published") {
    return "success";
  }

  if (status === "rejected" || status === "inactive") {
    return "danger";
  }

  if (status === "pending_review") {
    return "warning";
  }

  return "neutral";
}

export function EntrepreneurProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await entrepreneurService.getMyProfile();

        setProfile(data);
      } catch {
        setError("No fue posible cargar el perfil de emprendedora.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, []);

  if (isLoading) {
    return <Loader label="Cargando perfil..." />;
  }

  if (error) {
    return (
      <EmptyState title="No se pudo cargar el perfil" description={error} />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="Perfil no encontrado"
        description="Aún no existe información de perfil para esta emprendedora."
      />
    );
  }

  const city = profile.city ?? profile.user?.city ?? null;
  const department = profile.department ?? profile.user?.department ?? null;
  const country = profile.country ?? "Colombia";

  return (
    <section>
      <PageHeader
        eyebrow="Mi perfil"
        title="Perfil de emprendedora"
        description="Consulta el estado actual de tu perfil y la información registrada."
        actions={
          <Button onClick={() => navigate(paths.entrepreneur.editProfile)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar perfil
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-ink-900">
              Información principal
            </h2>

            <Badge variant={getStatusVariant(profile.status)}>
              {getStatusLabel(profile.status)}
            </Badge>
          </div>

          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Tipo de documento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {profile.documentType ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Número de documento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {profile.documentNumber ?? "No registrado"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {city ?? "No registrada"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {department ?? "No registrado"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Ubicación</h2>

          <p className="mt-3 text-sm leading-6 text-ink-500">
            {profile.locationText ??
              "No se ha registrado una ubicación textual."}
          </p>

          <p className="mt-4 text-sm font-medium text-ink-700">
            {city ?? "Ciudad no registrada"}
            {department ? `, ${department}` : ""}
            {country ? `, ${country}` : ""}
          </p>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Datos de cuenta</h2>

        <dl className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Nombre
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {profile.user
                ? `${profile.user.firstName} ${profile.user.lastName}`
                : "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Correo
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {profile.user?.email ?? "No registrado"}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              WhatsApp
            </dt>
            <dd className="mt-1 text-sm text-ink-900">
              {profile.user?.whatsapp ?? "No registrado"}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Emprendimientos asociados
        </h2>

        {profile.businesses && profile.businesses.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {profile.businesses.map((business) => (
              <div
                key={business.id}
                className="rounded-xl border border-ink-100 bg-ink-50 p-4"
              >
                <p className="font-semibold text-ink-900">{business.name}</p>
                <p className="mt-1 text-xs text-ink-500">{business.slug}</p>

                <div className="mt-3">
                  <Badge variant={getStatusVariant(business.status)}>
                    {getStatusLabel(business.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-500">
            Aún no tienes emprendimientos registrados.
          </p>
        )}
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Historia personal</h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {profile.personalStory ??
            "Aún no se ha registrado una historia personal."}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Biografía corta</h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {profile.shortBio ?? "Aún no se ha registrado una biografía corta."}
        </p>
      </Card>
    </section>
  );
}

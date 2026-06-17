import {
  ArrowLeft,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  Phone,
} from "lucide-react";
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
import { buildImageUrl } from "@/utils/image";

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

function getDisplayValue(value?: string | null) {
  return value && value.trim().length > 0 ? value : "No registrado";
}

function getContactEmail(business: BusinessDetail) {
  return business.contactEmail ?? business.email ?? null;
}

function getContactPhone(business: BusinessDetail) {
  return business.contactPhone ?? business.phone ?? null;
}

function getContactWhatsapp(business: BusinessDetail) {
  return business.contactWhatsapp ?? business.whatsapp ?? null;
}

function getAddressText(business: BusinessDetail) {
  return business.addressText ?? business.address ?? null;
}

function buildWhatsappUrl(phone?: string | null, businessName?: string) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return null;
  }

  const normalizedPhone =
    digits.startsWith("57") || digits.length > 10 ? digits : `57${digits}`;

  const message = `Hola, vi el emprendimiento ${businessName ?? ""} en Red Mujeres y quiero más información.`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
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
        description="No encontramos la información del emprendimiento solicitado."
      />
    );
  }

  const logoUrl = buildImageUrl(business.logoUrl);
  const bannerUrl = buildImageUrl(business.bannerUrl ?? business.coverImageUrl);

  const contactEmail = getContactEmail(business);
  const contactPhone = getContactPhone(business);
  const contactWhatsapp = getContactWhatsapp(business);
  const addressText = getAddressText(business);
  const whatsappUrl = buildWhatsappUrl(
    contactWhatsapp ?? contactPhone,
    business.name,
  );

  return (
    <section>
      <PageHeader
        eyebrow="Emprendimiento"
        title={business.name}
        description="Detalle del emprendimiento registrado en tu perfil."
        actions={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(paths.entrepreneur.businesses)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>

            <Button
              type="button"
              onClick={() => navigate(getBusinessEditPath(business.id))}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`Portada de ${business.name}`}
            className="h-52 w-full object-cover md:h-72"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-ink-50 text-sm text-ink-400 md:h-72">
            Sin banner registrado
          </div>
        )}

        <div className="flex flex-col gap-5 px-6 pb-6 pt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`Logo de ${business.name}`}
                className="h-24 w-24 rounded-2xl border border-ink-100 bg-white object-contain p-3 shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-100 bg-ink-50 text-xs text-ink-400">
                Sin logo
              </div>
            )}

            <div>
              <div className="mb-2">
                <Badge variant={getStatusVariant(business.status)}>
                  {getStatusLabel(business.status)}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-ink-900">
                {business.name}
              </h2>

              <p className="mt-1 text-sm text-ink-500">/{business.slug}</p>
            </div>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contactar por WhatsApp
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <h2 className="text-lg font-bold text-ink-900">
            Información general
          </h2>

          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Categoría principal
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(business.mainCategoryId)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Ciudad
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(business.city)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Departamento
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(business.department)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                País
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(business.country)}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Dirección
              </dt>
              <dd className="mt-1 text-sm text-ink-900">
                {getDisplayValue(addressText)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-ink-900">Contacto</h2>

          <dl className="mt-5 grid gap-4">
            <div className="flex gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 text-primary-600" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  WhatsApp
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contactWhatsapp)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary-600" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Teléfono
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contactPhone)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary-600" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Correo
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {getDisplayValue(contactEmail)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary-600" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                  Ubicación
                </dt>
                <dd className="mt-1 text-sm text-ink-900">
                  {[business.city, business.department, business.country]
                    .filter(Boolean)
                    .join(", ") || "No registrada"}
                </dd>
              </div>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Descripción corta</h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {business.shortDescription ?? "No hay descripción corta registrada."}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Descripción completa</h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {business.description ?? "No hay descripción registrada."}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">
          Historia del emprendimiento
        </h2>

        <p className="mt-3 text-sm leading-7 text-ink-500">
          {business.story ?? "No hay historia registrada."}
        </p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-lg font-bold text-ink-900">Redes sociales</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          {business.facebookUrl ? (
            <a
              href={business.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Facebook
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : null}

          {business.instagramUrl ? (
            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Instagram
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : null}

          {business.tiktokUrl ? (
            <a
              href={business.tiktokUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              TikTok
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : null}

          {business.websiteUrl ? (
            <a
              href={business.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-xl border border-ink-100 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              <Globe2 className="mr-2 h-4 w-4" />
              Sitio web
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          ) : null}

          {!business.facebookUrl &&
          !business.instagramUrl &&
          !business.tiktokUrl &&
          !business.websiteUrl ? (
            <p className="text-sm text-ink-500">
              No hay redes sociales registradas.
            </p>
          ) : null}
        </div>
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
              Productos asociados
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Los productos se gestionan desde el módulo de productos.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

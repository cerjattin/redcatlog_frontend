import {
  ArrowLeft,
  ImageOff,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { publicBusinessService } from "@/features/public/api/publicBusiness.service";
import { PublicLayout } from "@/features/public/components/PublicLayout";
import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import type { PublicBusiness } from "@/features/public/types/publicBusiness.types";
import {
  buildPublicBusinessWhatsappUrl,
  getPublicBusinessBannerUrl,
  getPublicBusinessCategoryName,
  getPublicBusinessDescription,
  getPublicBusinessLocation,
  getPublicBusinessLogoUrl,
  getPublicBusinessName,
  getPublicBusinessProductsCount,
} from "@/features/public/utils/businessDisplay";
import { paths } from "@/routes/paths";
import { buildImageUrl } from "@/utils/image";

function getCatalogByEntrepreneurPath(entrepreneur: PublicBusiness) {
  return `${paths.public.catalog}?entrepreneurId=${entrepreneur.id}`;
}

function getCategoryCatalogPath(entrepreneur: PublicBusiness) {
  if (!entrepreneur.categoryId) {
    return paths.public.catalog;
  }

  return `${paths.public.catalog}?categoryId=${entrepreneur.categoryId}`;
}

export function PublicEntrepreneurDetailPage() {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [entrepreneur, setEntrepreneur] = useState<PublicBusiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEntrepreneur() {
      if (!params.slug) {
        setLoadError("No se encontró la emprendedora solicitada.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const data = await publicBusinessService.getBusinessBySlug(params.slug);

        setEntrepreneur(data);
      } catch {
        setLoadError("No fue posible cargar el perfil de la emprendedora.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadEntrepreneur();
  }, [params.slug]);

  if (isLoading) {
    return (
      <PublicLayout active="Emprendedoras">
        <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="h-96 animate-pulse rounded-[2rem] bg-[#f4ecff]" />
        </main>
      </PublicLayout>
    );
  }

  if (loadError || !entrepreneur) {
    return (
      <PublicLayout active="Emprendedoras">
        <main className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8">
          <div className="rounded-[2rem] bg-[#fff4f4] p-8">
            <h1 className="text-2xl font-black text-[#211734]">
              Perfil no disponible
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#6d6383]">
              {loadError ??
                "No encontramos información para esta emprendedora."}
            </p>

            <Link
              to={paths.public.entrepreneurs}
              className="mt-6 inline-flex rounded-2xl bg-[#7b3fe4] px-5 py-3 text-sm font-bold text-white"
            >
              Ver emprendedoras
            </Link>
          </div>
        </main>
      </PublicLayout>
    );
  }

  const name = getPublicBusinessName(entrepreneur);
  const bannerUrl = getPublicBusinessBannerUrl(entrepreneur);
  const photoUrl = getPublicBusinessLogoUrl(entrepreneur);
  const description = getPublicBusinessDescription(entrepreneur);
  const categoryName = getPublicBusinessCategoryName(entrepreneur);
  const location = getPublicBusinessLocation(entrepreneur);
  const whatsappUrl = buildPublicBusinessWhatsappUrl(entrepreneur);
  const productsCount = getPublicBusinessProductsCount(entrepreneur);

  return (
    <PublicLayout active="Emprendedoras">
      <main className="bg-[#fbf8ff]">
        <section className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-bold text-[#7b3fe4]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </button>

          <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
            <div className="relative h-72 bg-[#f4ecff]">
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt={`Banner de ${name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#8e80aa]">
                  <ImageOff className="h-10 w-10" />
                </div>
              )}
            </div>

            <div className="px-6 pb-8 md:px-10">
              <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-5 md:flex-row md:items-end">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-lg">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={`Foto de ${name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-9 w-9 text-[#8e80aa]" />
                    )}
                  </div>

                  <div className="pb-2">
                    <h1 className="text-4xl font-black text-[#211734] md:text-5xl">
                      {name}
                    </h1>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to={getCategoryCatalogPath(entrepreneur)}
                        className="inline-flex items-center rounded-full bg-[#f4ecff] px-4 py-2 text-xs font-bold text-[#7b3fe4]"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        {categoryName}
                      </Link>

                      <Link
                        to={getCatalogByEntrepreneurPath(entrepreneur)}
                        className="inline-flex items-center rounded-full bg-[#fff0ea] px-4 py-2 text-xs font-bold text-[#c45f3f]"
                      >
                        <Package className="mr-2 h-4 w-4" />
                        {productsCount} producto
                        {productsCount === 1 ? "" : "s"}
                      </Link>
                    </div>
                  </div>
                </div>

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-2xl bg-[#25d366] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1db954]"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
            <article className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(58,36,103,0.08)] md:p-8">
              <h2 className="text-2xl font-black text-[#211734]">
                Historia y perfil
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#6d6383]">
                {description}
              </p>

              {entrepreneur.personalStory ? (
                <>
                  <h3 className="mt-8 text-xl font-black text-[#211734]">
                    Historia personal
                  </h3>

                  <p className="mt-4 text-sm leading-8 text-[#6d6383]">
                    {entrepreneur.personalStory}
                  </p>
                </>
              ) : null}

              {entrepreneur.products?.length ? (
                <>
                  <h3 className="mt-8 text-xl font-black text-[#211734]">
                    Productos destacados
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {entrepreneur.products.map((product) => (
                      <Link
                        key={product.id}
                        to={paths.public.productDetail.replace(
                          ":slug",
                          product.slug,
                        )}
                        className="overflow-hidden rounded-2xl border border-[#efe8f8] bg-white transition hover:-translate-y-1 hover:shadow-md"
                      >
                        {product.mainImageUrl ? (
                          <img
                            src={buildImageUrl(product.mainImageUrl) ?? ""}
                            alt={product.name}
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-36 items-center justify-center bg-[#f4ecff]">
                            <ImageOff className="h-6 w-6 text-[#8e80aa]" />
                          </div>
                        )}

                        <div className="p-4">
                          <p className="line-clamp-2 text-sm font-bold text-[#211734]">
                            {product.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </article>

            <aside className="space-y-6">
              <div className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
                <h2 className="text-xl font-black text-[#211734]">Contacto</h2>

                <div className="mt-5 space-y-4 text-sm text-[#6d6383]">
                  {location ? (
                    <p className="flex items-center">
                      <MapPin className="mr-3 h-4 w-4 text-[#ff9f82]" />
                      {location}
                    </p>
                  ) : null}

                  {entrepreneur.phone ? (
                    <p className="flex items-center">
                      <Phone className="mr-3 h-4 w-4 text-[#ff9f82]" />
                      {entrepreneur.phone}
                    </p>
                  ) : null}

                  {entrepreneur.whatsapp ? (
                    <p className="flex items-center">
                      <MessageCircle className="mr-3 h-4 w-4 text-[#ff9f82]" />
                      {entrepreneur.whatsapp}
                    </p>
                  ) : null}

                  {entrepreneur.email ? (
                    <a
                      href={`mailto:${entrepreneur.email}`}
                      className="flex items-center hover:text-[#7b3fe4]"
                    >
                      <Mail className="mr-3 h-4 w-4 text-[#ff9f82]" />
                      {entrepreneur.email}
                    </a>
                  ) : null}
                </div>

                <PublicSocialLinks
                  className="mt-6"
                  facebookUrl={entrepreneur.facebookUrl}
                  instagramUrl={entrepreneur.instagramUrl}
                  tiktokUrl={entrepreneur.tiktokUrl}
                />
              </div>

              <div className="rounded-[2rem] bg-[#211734] p-6 text-white">
                <h2 className="text-xl font-black">Ver catálogo</h2>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  Explora todos los productos publicados por esta emprendedora
                  en REDMUEMMA.
                </p>

                <Link
                  to={getCatalogByEntrepreneurPath(entrepreneur)}
                  className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#211734]"
                >
                  Ver productos
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

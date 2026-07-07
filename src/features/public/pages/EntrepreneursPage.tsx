import axios from "axios";
import {
  AlertCircle,
  MapPin,
  MessageCircle,
  Package,
  Search,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { PublicPagination } from "@/features/public/components/PublicPagination";
import { publicBusinessService } from "@/features/public/api/publicBusiness.service";
import {
  PublicFooter,
  PublicHeader,
} from "@/features/public/components/PublicLayout";
import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import type {
  PublicBusiness,
  PublicBusinessesPagination,
} from "@/features/public/types/publicBusiness.types";
import {
  buildPublicBusinessWhatsappUrl,
  getPublicBusinessBannerUrl,
  getPublicBusinessCategoryName,
  getPublicBusinessDescription,
  getPublicBusinessLocation,
  getPublicBusinessLogoUrl,
  getPublicBusinessProductsCount,
} from "@/features/public/utils/businessDisplay";

const PAGE_SIZE = 12;

function getApiErrorMessage(error: unknown) {
  console.error("Error cargando emprendimientos públicos:", error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string } | undefined;

    if (!error.response) {
      return "No hay conexión con el backend. Verifica que el servidor esté corriendo en http://localhost:4000.";
    }

    if (status === 404) {
      return "El backend todavía no tiene disponible el endpoint público de emprendimientos: /api/public/businesses.";
    }

    return (
      data?.message ??
      `No fue posible cargar los emprendimientos. Código HTTP: ${status}.`
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible cargar los emprendimientos.";
}

function getPublicEntrepreneurDetailPath(slug?: string | null) {
  if (!slug) {
    return paths.public.entrepreneurs;
  }

  return paths.public.entrepreneurDetail.replace(":slug", slug);
}

function EntrepreneursHero() {
  return (
    <section className="px-5 pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto flex max-w-[1224px] flex-col items-center justify-center gap-7 text-center md:flex-row md:text-left">
        <div className="flex h-[190px] w-[230px] items-center justify-center rounded-[48px] bg-[#fff0ea] md:h-[230px] md:w-[270px]">
          <Users className="h-24 w-24 text-[#ff9f82]" />
        </div>

        <div className="min-w-0 max-w-full">
          <h1 className="max-w-full break-words text-[38px] font-bold leading-tight text-[#211734] sm:text-5xl md:text-[56px]">
            Emprendedoras de la Red
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#6d6383] md:text-2xl">
            Conoce las historias, productos y datos de contacto de las
            emprendedoras que forman parte de nuestra red.
          </p>
        </div>
      </div>
    </section>
  );
}

function EntrepreneursControls({
  query,
  onQueryChange,
  onSearch,
  onClear,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <label className="flex h-14 flex-1 items-center gap-4 rounded-full border border-[#cfc5df] bg-white px-5 text-[#6d6383]">
          <Search size={22} />

          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar emprendedoras, ciudades o categorías..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8e80aa]"
          />
        </label>

        <button
          type="submit"
          className="hidden h-14 rounded-full border border-[#cfc5df] bg-white px-6 text-sm font-medium text-[#6d6383] transition hover:border-[#d66eff] hover:text-[#3a2467] sm:block"
        >
          Buscar
        </button>

        <button
          type="button"
          onClick={onClear}
          className="hidden h-14 rounded-full border border-[#cfc5df] bg-white px-6 text-sm font-medium text-[#6d6383] transition hover:border-[#d66eff] hover:text-[#3a2467] sm:block"
        >
          Limpiar
        </button>
      </form>
    </div>
  );
}

function BusinessSocialLinks({ business }: { business: PublicBusiness }) {
  return (
    <PublicSocialLinks
      className="mt-5"
      facebookUrl={business.facebookUrl}
      instagramUrl={business.instagramUrl}
      tiktokUrl={business.tiktokUrl}
    />
  );
}

function BusinessCard({ business }: { business: PublicBusiness }) {
  const bannerUrl = getPublicBusinessBannerUrl(business);
  const logoUrl = getPublicBusinessLogoUrl(business);
  const description = getPublicBusinessDescription(business);
  const categoryName = getPublicBusinessCategoryName(business);
  const location = getPublicBusinessLocation(business);
  const productsCount = getPublicBusinessProductsCount(business);
  const whatsappUrl = buildPublicBusinessWhatsappUrl(business);

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
      <div className="relative h-52 bg-[#f7eef8]">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`Banner de ${
              business.fullName ||
              `${business.firstName ?? ""} ${business.lastName ?? ""}`.trim() ||
              "emprendedora"
            }`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Store className="h-20 w-20 text-[#dcbdd8]" />
          </div>
        )}

        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#3a2467] shadow-sm">
          {categoryName}
        </span>
      </div>

      <div className="relative px-6 pb-8 pt-12">
        <div className="absolute -top-10 left-6 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Banner de ${
                business.fullName ||
                `${business.firstName ?? ""} ${business.lastName ?? ""}`.trim() ||
                "emprendedora"
              }`}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Store className="h-9 w-9 text-[#ff9f82]" />
          )}
        </div>

        <Link
          to={getPublicEntrepreneurDetailPath(business.slug)}
          className="block text-2xl font-bold text-[#211734] transition hover:text-[#7b3fe4]"
        >
          {business.fullName ||
            `${business.firstName ?? ""} ${business.lastName ?? ""}`.trim() ||
            `Emprendedora #${business.id}`}
        </Link>

        {business.category?.name ? (
          <p className="mt-1 text-sm font-medium text-[#8e80aa]">
            {business.category.name}
          </p>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6d6383]">
          {description}
        </p>

        <div className="mt-5 grid gap-2 text-sm text-[#6d6383]">
          {location ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ff9f82]" />
              <span>{location}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#ff9f82]" />
            <span>
              {productsCount === 1
                ? "1 producto publicado"
                : `${productsCount} productos publicados`}
            </span>
          </div>
        </div>

        <BusinessSocialLinks business={business} />

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#35c46a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2ead5c]"
          >
            <MessageCircle className="h-5 w-5" />
            Contactar por WhatsApp
          </a>
        ) : (
          <div className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#6d6383]/15 px-5 py-3 text-sm font-bold text-[#6d6383]">
            Contacto no disponible
          </div>
        )}
      </div>
    </article>
  );
}

function BusinessCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[28px] bg-white">
      <div className="h-52 animate-pulse bg-[#f3edf7]" />

      <div className="space-y-4 px-6 pb-8 pt-12">
        <div className="h-7 w-52 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-5 w-40 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-20 w-full animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-12 w-full animate-pulse rounded-full bg-[#f3edf7]" />
      </div>
    </article>
  );
}

export function EntrepreneursPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [businesses, setBusinesses] = useState<PublicBusiness[]>([]);
  const [pagination, setPagination] =
    useState<PublicBusinessesPagination | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBusinesses() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await publicBusinessService.getBusinesses({
          page,
          limit: PAGE_SIZE,
          search: searchTerm || undefined,
        });

        if (!isMounted) {
          return;
        }

        setBusinesses(data.businesses);
        setPagination(data.pagination);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(getApiErrorMessage(error));
        setBusinesses([]);
        setPagination(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadBusinesses();

    return () => {
      isMounted = false;
    };
  }, [page, searchTerm]);

  function handleSearch() {
    setPage(1);
    setSearchTerm(query.trim());
  }

  function handleClear() {
    setQuery("");
    setSearchTerm("");
    setPage(1);
  }

  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;
  const totalBusinesses = pagination?.total ?? businesses.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active="Emprendedoras" />

      <main className="relative overflow-hidden bg-[linear-gradient(135deg,#fff9fa_0%,#fff_46%,#fff0ea_100%)]">
        <EntrepreneursHero />

        <EntrepreneursControls
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <section className="mx-auto max-w-[1224px] px-5 pt-8 lg:px-0">
          <p className="mb-4 text-base font-medium text-[#6d6383]">
            Mostrando {businesses.length} emprendedoras de {totalBusinesses}
          </p>

          {errorMessage ? (
            <div className="mb-6 flex items-center gap-3 rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <BusinessCardSkeleton key={`business-skeleton-${index}`} />
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">
              No encontramos emprendedoras publicadas.
            </div>
          )}

          <PublicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasPreviousPage={pagination?.hasPreviousPage}
            hasNextPage={pagination?.hasNextPage}
            onPrevious={() => setPage((current) => Math.max(current - 1, 1))}
            onNext={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
          />
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

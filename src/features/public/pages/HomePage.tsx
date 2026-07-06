import {
  ArrowRight,
  HeartHandshake,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { publicBusinessService } from "@/features/public/api/publicBusiness.service";
import { publicProductService } from "@/features/public/api/publicProduct.service";
import { PublicLayout } from "@/features/public/components/PublicLayout";
import type { PublicBusiness } from "@/features/public/types/publicBusiness.types";
import type {
  PublicProduct,
  PublicProductCategory,
} from "@/features/public/types/publicProduct.types";
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
import {
  formatPublicProductPrice,
  getPublicProductEntrepreneurName,
  getPublicProductLocation,
  getPublicProductMainImage,
  getPublicProductWhatsappPhone,
} from "@/features/public/utils/productDisplay";
import { buildWhatsappUrl } from "@/features/public/utils/whatsapp";
import { paths } from "@/routes/paths";

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
};

const fallbackCategories: HomeCategory[] = [
  {
    id: "",
    name: "Artesanías",
    slug: "artesanias",
    productsCount: 0,
  },
  {
    id: "",
    name: "Gastronomía",
    slug: "gastronomia",
    productsCount: 0,
  },
  {
    id: "",
    name: "Belleza",
    slug: "belleza",
    productsCount: 0,
  },
  {
    id: "",
    name: "Moda",
    slug: "moda",
    productsCount: 0,
  },
];

function buildHomeCategories(products: PublicProduct[]): HomeCategory[] {
  const categoryMap = new Map<string, HomeCategory>();

  products.forEach((product) => {
    const category = product.category;

    if (!category?.id) {
      return;
    }

    const current = categoryMap.get(category.id);

    if (current) {
      categoryMap.set(category.id, {
        ...current,
        productsCount: current.productsCount + 1,
      });

      return;
    }

    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug,
      productsCount: 1,
    });
  });

  const categories = Array.from(categoryMap.values()).sort((first, second) => {
    return second.productsCount - first.productsCount;
  });

  return categories.length > 0 ? categories.slice(0, 6) : fallbackCategories;
}

function getUniqueCitiesCount(entrepreneurs: PublicBusiness[]) {
  const cities = new Set<string>();

  entrepreneurs.forEach((entrepreneur) => {
    const location =
      entrepreneur.city || entrepreneur.locationText || entrepreneur.department;

    if (location) {
      cities.add(location.trim().toLowerCase());
    }
  });

  return cities.size;
}

function getCategoryHref(category: HomeCategory | PublicProductCategory) {
  if (!category.id) {
    return paths.public.catalog;
  }

  return `${paths.public.catalog}?categoryId=${category.id}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8f3ff]">
      <div className="absolute left-[-10rem] top-[-10rem] h-80 w-80 rounded-full bg-[#dfc8ff]/60 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-[#f7b6d2]/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#7b3fe4] shadow-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Catálogo digital con propósito
          </span>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-[#211734] md:text-6xl">
            Productos creados por mujeres que transforman historias en
            oportunidades.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6d6383]">
            REDMUEMMA conecta a emprendedoras con compradores, instituciones y
            comunidades que valoran el talento, la resiliencia y el comercio con
            impacto social.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={paths.public.catalog}
              className="inline-flex items-center justify-center rounded-2xl bg-[#7b3fe4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7b3fe4]/20 transition hover:-translate-y-0.5 hover:bg-[#6b31d2]"
            >
              Ver catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              to={paths.public.entrepreneurs}
              className="inline-flex items-center justify-center rounded-2xl border border-[#ded4ef] bg-white px-6 py-3 text-sm font-bold text-[#35264d] transition hover:-translate-y-0.5 hover:border-[#c7b4e8]"
            >
              Conocer emprendedoras
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-2xl shadow-[#7b3fe4]/10 backdrop-blur">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-[#7b3fe4] via-[#9b5cff] to-[#f36ca5] p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                REDMUEMMA
              </span>

              <HeartHandshake className="h-8 w-8" />
            </div>

            <h2 className="mt-16 text-3xl font-black">
              Una vitrina para vender, visibilizar y crecer.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/85">
              Productos con historia, contacto directo por WhatsApp y perfiles
              de emprendedoras organizados por categoría.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <Package className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold">Catálogo activo</p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <UsersRound className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold">Mujeres visibles</p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <Tags className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold">Categorías</p>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <ShieldCheck className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold">Gestión editorial</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Impact({
  productsTotal,
  entrepreneursTotal,
  categoriesTotal,
  citiesTotal,
}: {
  productsTotal: number;
  entrepreneursTotal: number;
  categoriesTotal: number;
  citiesTotal: number;
}) {
  const items = [
    {
      label: "Productos publicados",
      value: productsTotal,
      icon: Package,
    },
    {
      label: "Emprendedoras visibles",
      value: entrepreneursTotal,
      icon: UsersRound,
    },
    {
      label: "Categorías activas",
      value: categoriesTotal,
      icon: Tags,
    },
    {
      label: "Territorios representados",
      value: citiesTotal,
      icon: MapPin,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-3xl border border-[#efe8f8] bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ecff] text-[#7b3fe4]">
                <Icon className="h-6 w-6" />
              </div>

              <strong className="mt-5 block text-3xl font-black text-[#211734]">
                {item.value}
              </strong>

              <p className="mt-1 text-sm font-medium text-[#6d6383]">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Categories({ categories }: { categories: HomeCategory[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#7b3fe4]">
            Explora
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#211734] md:text-4xl">
            Categorías de productos
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d6383]">
            Encuentra productos publicados por las emprendedoras de REDMUEMMA
            según su categoría.
          </p>
        </div>

        <Link
          to={paths.public.catalog}
          className="inline-flex items-center text-sm font-bold text-[#7b3fe4]"
        >
          Ver todo el catálogo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={`${category.id}-${category.slug}`}
            to={getCategoryHref(category)}
            className="group rounded-3xl border border-[#efe8f8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7b3fe4]/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ecff] text-[#7b3fe4] transition group-hover:bg-[#7b3fe4] group-hover:text-white">
              <Tags className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-xl font-black text-[#211734]">
              {category.name}
            </h3>

            <p className="mt-2 text-sm text-[#6d6383]">
              {category.productsCount > 0
                ? `${category.productsCount} producto${
                    category.productsCount === 1 ? "" : "s"
                  }`
                : "Explorar productos"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function EntrepreneurCard({ entrepreneur }: { entrepreneur: PublicBusiness }) {
  const name = getPublicBusinessName(entrepreneur);
  const logoUrl = getPublicBusinessLogoUrl(entrepreneur);
  const bannerUrl = getPublicBusinessBannerUrl(entrepreneur);
  const location = getPublicBusinessLocation(entrepreneur);
  const categoryName = getPublicBusinessCategoryName(entrepreneur);
  const whatsappUrl = buildPublicBusinessWhatsappUrl(entrepreneur);
  const productsCount = getPublicBusinessProductsCount(entrepreneur);

  return (
    <article className="overflow-hidden rounded-3xl border border-[#efe8f8] bg-white shadow-sm">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt={`Banner de ${name}`}
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="h-36 bg-gradient-to-br from-[#7b3fe4] via-[#a36cff] to-[#f36ca5]" />
      )}

      <div className="p-5">
        <div className="-mt-14 flex items-end justify-between gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Foto de ${name}`}
              className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#f4ecff] text-lg font-black text-[#7b3fe4] shadow-md">
              {getInitials(name) || "R"}
            </div>
          )}

          <span className="rounded-full bg-[#f4ecff] px-3 py-1 text-xs font-bold text-[#7b3fe4]">
            {productsCount} producto{productsCount === 1 ? "" : "s"}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-black text-[#211734]">{name}</h3>

        <p className="mt-1 text-sm font-semibold text-[#8e80aa]">
          {categoryName}
        </p>

        {location ? (
          <p className="mt-2 flex items-center text-sm text-[#6d6383]">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </p>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6d6383]">
          {getPublicBusinessDescription(entrepreneur)}
        </p>

        <div className="mt-5 flex gap-3">
          <Link
            to={paths.public.entrepreneurs}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-[#ded4ef] bg-white px-4 py-3 text-sm font-bold text-[#35264d] transition hover:border-[#c7b4e8]"
          >
            Ver perfil
          </Link>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1db954]"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Entrepreneurs({
  entrepreneurs,
  isLoading,
}: {
  entrepreneurs: PublicBusiness[];
  isLoading: boolean;
}) {
  return (
    <section className="bg-[#fbf8ff] py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#7b3fe4]">
              Historias
            </span>

            <h2 className="mt-3 text-3xl font-black text-[#211734] md:text-4xl">
              Emprendedoras destacadas
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d6383]">
              Conoce mujeres que hacen parte de REDMUEMMA y descubre sus
              productos, datos de contacto y redes sociales.
            </p>
          </div>

          <Link
            to={paths.public.entrepreneurs}
            className="inline-flex items-center text-sm font-bold text-[#7b3fe4]"
          >
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-96 animate-pulse rounded-3xl bg-white"
                />
              ))
            : entrepreneurs.map((entrepreneur) => (
                <EntrepreneurCard
                  key={entrepreneur.id}
                  entrepreneur={entrepreneur}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: PublicProduct }) {
  const imageUrl = getPublicProductMainImage(product);
  const entrepreneurName = getPublicProductEntrepreneurName(product);
  const location = getPublicProductLocation(product);
  const whatsappPhone = getPublicProductWhatsappPhone(product);
  const whatsappUrl = buildWhatsappUrl({
    phone: whatsappPhone,
    productName: product.name,
    businessName: entrepreneurName,
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-[#efe8f8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7b3fe4]/10">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-56 w-full object-cover"
        />

        {product.category?.name ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#7b3fe4] shadow-sm">
            {product.category.name}
          </span>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-black text-[#211734]">
          {product.name}
        </h3>

        <p className="mt-2 text-sm font-semibold text-[#8e80aa]">
          Por {entrepreneurName}
        </p>

        {location ? (
          <p className="mt-2 flex items-center text-sm text-[#6d6383]">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </p>
        ) : null}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6d6383]">
          {product.shortDescription ||
            product.description ||
            "Producto publicado en REDMUEMMA."}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <strong className="text-lg font-black text-[#211734]">
            {formatPublicProductPrice(product)}
          </strong>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-[#25d366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#1db954]"
            >
              Consultar
            </a>
          ) : (
            <Link
              to={paths.public.catalog}
              className="inline-flex items-center justify-center rounded-2xl border border-[#ded4ef] px-4 py-2.5 text-sm font-bold text-[#35264d]"
            >
              Ver catálogo
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function Products({
  products,
  isLoading,
}: {
  products: PublicProduct[];
  isLoading: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#7b3fe4]">
            Catálogo
          </span>

          <h2 className="mt-3 text-3xl font-black text-[#211734] md:text-4xl">
            Productos destacados
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d6383]">
            Explora productos publicados por las emprendedoras de REDMUEMMA y
            contáctalas directamente.
          </p>
        </div>

        <Link
          to={paths.public.catalog}
          className="inline-flex items-center text-sm font-bold text-[#7b3fe4]"
        >
          Ir al catálogo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-3xl bg-[#f4ecff]"
              />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-[#211734] py-16 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2rem] bg-white/10 p-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6">
            <HeartHandshake className="h-10 w-10 text-[#f6c6dc]" />

            <h2 className="mt-8 text-3xl font-black">
              REDMUEMMA es una plataforma para vender con propósito.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/75">
              El catálogo permite organizar productos, destacar perfiles de
              emprendedoras y facilitar el contacto directo a través de
              WhatsApp, redes sociales y datos públicos.
            </p>
          </div>
        </div>

        <div>
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#f6c6dc]">
            Impacto
          </span>

          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Una vitrina digital para fortalecer autonomía económica.
          </h2>

          <p className="mt-5 text-base leading-8 text-white/75">
            La nueva lógica de REDMUEMMA centraliza la comercialización bajo la
            plataforma y conecta cada producto directamente con su emprendedora.
            Así se simplifica la operación editorial, se mejora la experiencia
            del comprador y se visibiliza mejor a cada mujer.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <Search className="h-6 w-6 text-[#f6c6dc]" />
              <h3 className="mt-4 font-bold">Búsqueda simple</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Productos y emprendedoras organizados por categoría.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <ShieldCheck className="h-6 w-6 text-[#f6c6dc]" />
              <h3 className="mt-4 font-bold">Control editorial</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Admin y editor gestionan estados, imágenes y aprobaciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="rounded-[2rem] bg-[#f8f3ff] p-8 text-center md:p-12">
        <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#7b3fe4]">
          REDMUEMMA
        </span>

        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-[#211734] md:text-5xl">
          Descubre productos con historia y compra directamente a sus creadoras.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#6d6383]">
          Explora el catálogo público, encuentra productos por categoría y
          contacta a las emprendedoras por WhatsApp.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={paths.public.catalog}
            className="inline-flex items-center justify-center rounded-2xl bg-[#7b3fe4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#7b3fe4]/20 transition hover:bg-[#6b31d2]"
          >
            Explorar catálogo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            to={paths.public.entrepreneurs}
            className="inline-flex items-center justify-center rounded-2xl border border-[#ded4ef] bg-white px-6 py-3 text-sm font-bold text-[#35264d] transition hover:border-[#c7b4e8]"
          >
            Ver emprendedoras
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<PublicBusiness[]>([]);

  const [productsTotal, setProductsTotal] = useState(0);
  const [entrepreneursTotal, setEntrepreneursTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        setIsLoading(true);
        setHomeError(null);

        const [productsResult, entrepreneursResult] = await Promise.allSettled([
          publicProductService.getProducts({
            page: 1,
            limit: 12,
          }),
          publicBusinessService.getBusinesses({
            page: 1,
            limit: 6,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value.products);
          setProductsTotal(productsResult.value.pagination.total);
        } else {
          setProducts([]);
          setProductsTotal(0);
        }

        if (entrepreneursResult.status === "fulfilled") {
          setEntrepreneurs(entrepreneursResult.value.businesses);
          setEntrepreneursTotal(entrepreneursResult.value.pagination.total);
        } else {
          setEntrepreneurs([]);
          setEntrepreneursTotal(0);
        }

        if (
          productsResult.status === "rejected" &&
          entrepreneursResult.status === "rejected"
        ) {
          setHomeError(
            "No fue posible cargar la información pública desde el backend.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const homeCategories = useMemo(() => {
    return buildHomeCategories(products);
  }, [products]);

  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.isFeatured);

    return (featured.length > 0 ? featured : products).slice(0, 4);
  }, [products]);

  const featuredEntrepreneurs = useMemo(() => {
    const featured = entrepreneurs.filter(
      (entrepreneur) => entrepreneur.isFeatured,
    );

    return (featured.length > 0 ? featured : entrepreneurs).slice(0, 3);
  }, [entrepreneurs]);

  const citiesTotal = useMemo(() => {
    return getUniqueCitiesCount(entrepreneurs);
  }, [entrepreneurs]);

  return (
    <PublicLayout active="Inicio">
      <main>
        <Hero />

        {homeError ? (
          <div className="mx-auto mt-6 max-w-7xl px-5 md:px-8">
            <div className="rounded-2xl bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
              {homeError}
            </div>
          </div>
        ) : null}

        <Impact
          productsTotal={productsTotal}
          entrepreneursTotal={entrepreneursTotal}
          categoriesTotal={homeCategories.length}
          citiesTotal={citiesTotal}
        />

        <Categories categories={homeCategories} />

        <Entrepreneurs
          entrepreneurs={featuredEntrepreneurs}
          isLoading={isLoading}
        />

        <Products products={featuredProducts} isLoading={isLoading} />

        <Story />

        <CallToAction />
      </main>
    </PublicLayout>
  );
}

import {
  ArrowRight,
  BookOpenText,
  Heart,
  Lightbulb,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
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
  formatPublicProductPrice,
  getPublicProductEntrepreneurName,
  getPublicProductMainImage,
} from "@/features/public/utils/productDisplay";
import { paths } from "@/routes/paths";

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  productsCount: number;
};

const fallbackCategories: HomeCategory[] = [
  { id: "", name: "Artesanías", slug: "artesanias", productsCount: 0 },
  { id: "", name: "Gastronomía", slug: "gastronomia", productsCount: 0 },
  { id: "", name: "Belleza", slug: "belleza", productsCount: 0 },
  { id: "", name: "Moda", slug: "moda", productsCount: 0 },
];

const categoryImages: Record<string, string> = {
  artesanias: "/home/category-crafts.jpg",
  gastronomia: "/home/category-food.jpg",
  belleza: "/home/category-beauty.jpg",
  moda: "/home/category-fashion.jpg",
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHomeCategories(products: PublicProduct[]): HomeCategory[] {
  const categoryMap = new Map<string, HomeCategory>();

  products.forEach((product) => {
    const category = product.category;

    if (!category?.id) return;

    const current = categoryMap.get(category.id);

    categoryMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: category.slug || normalizeSlug(category.name),
      productsCount: (current?.productsCount ?? 0) + 1,
    });
  });

  const categories = Array.from(categoryMap.values()).sort(
    (first, second) => second.productsCount - first.productsCount,
  );

  return categories.length > 0 ? categories.slice(0, 4) : fallbackCategories;
}

function getUniqueCitiesCount(entrepreneurs: PublicBusiness[]) {
  const cities = new Set<string>();

  entrepreneurs.forEach((entrepreneur) => {
    const location =
      entrepreneur.city || entrepreneur.locationText || entrepreneur.department;

    if (location) cities.add(location.trim().toLowerCase());
  });

  return cities.size;
}

function getCategoryHref(category: HomeCategory | PublicProductCategory) {
  return category.id
    ? `${paths.public.catalog}?categoryId=${category.id}`
    : paths.public.catalog;
}

function formatStatValue(value: number) {
  if (value >= 1000) return `${Math.floor(value / 100) / 10}k+`;
  return value > 0 ? `${value}+` : "0";
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold leading-[1.1] text-[#211734] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-3 text-base leading-[1.35] text-[#6d6383] md:text-2xl">
        {subtitle}
      </p>
    </div>
  );
}

function PrimaryLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#211734] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_12px_rgba(55,19,129,0.1)] transition hover:bg-[#3a2467] md:text-lg"
    >
      {children}
    </Link>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[radial-gradient(circle_at_0%_5%,#ffe3e3_0%,#fffcfc_50%,#f2e3ff_100%)] pt-[104px] lg:min-h-[900px]">
      <div className="relative mx-auto grid max-w-[1224px] items-center gap-10 px-5 py-14 md:px-8 lg:min-h-[796px] lg:grid-cols-[656px_1fr] lg:px-0 lg:py-16">
        <div className="relative z-10">
          <h1 className="max-w-[656px] text-[46px] font-bold leading-none tracking-[-0.035em] text-[#3a2467] sm:text-6xl lg:text-[72px]">
            Transformando historias en{" "}
            <span className="text-[#d14e75]">oportunidades</span>
          </h1>

          <p className="mt-8 max-w-[656px] text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            Descubre emprendimientos únicos creados por mujeres extraordinarias.
            Cada producto cuenta una historia de resiliencia, creatividad y
            esperanza.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <PrimaryLink to={paths.public.catalog}>
              Explorar catálogo <BookOpenText className="h-5 w-5" />
            </PrimaryLink>
            <Link
              to={paths.public.about}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6d6383] px-6 py-3.5 text-sm font-bold text-[#6d6383] transition hover:bg-white/70 md:text-lg"
            >
              Conocer historias
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] md:max-w-[640px] lg:max-w-[720px] lg:translate-x-8">
          <img
            src="/home/hero2.png"
            alt="Mujeres emprendedoras con productos"
            className="relative z-10 w-full"
          />

          <div className="absolute -bottom-5 left-0 z-20 w-[150px] rounded-[24px] bg-[#d66eff] p-5 text-white shadow-xl sm:left-[-32px]">
            <div className="flex items-start gap-2 text-lg font-bold leading-tight">
              <ShoppingBag className="mt-0.5 h-6 w-6 shrink-0" />
              <span>Apoya marcas locales</span>
            </div>
            <p className="mt-3 rounded-full bg-white/25 px-3 py-1 text-center text-[10px]">
              Comercio 100% responsable
            </p>
          </div>

          <div className="absolute right-0 top-[46%] z-20 rounded-2xl bg-[#ff9f82] px-4 py-3 text-sm font-bold leading-tight text-[#3a2467] shadow-lg">
            Llenas de
            <br /> creatividad
            <br /> y cultura
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 flex items-end opacity-90">
        <span className="h-14 w-14 rounded-r-full bg-[#a0b8fb]" />
        <span className="h-16 w-20 bg-[#fbab8e]" />
        <span className="h-20 w-20 bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
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
      label: "Mujeres emprendedoras",
      value: entrepreneursTotal,
      icon: UsersRound,
      color: "#d94673",
      bg: "#ff88ac1a",
    },
    {
      label: "Productos únicos",
      value: productsTotal,
      icon: Package,
      color: "#698ae5",
      bg: "#a0b8fb1a",
    },
    {
      label: "Categorías",
      value: categoriesTotal,
      icon: Heart,
      color: "#fb7d58",
      bg: "#fbab8e1a",
    },
    {
      label: "Ciudades",
      value: citiesTotal,
      icon: MapPin,
      color: "#b545df",
      bg: "#d66eff1a",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(75deg,#ffe9f0_4%,#fff_100%)] py-14 md:py-[72px]">
      <div className="mx-auto grid max-w-[1224px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.45fr] lg:px-0">
        <div>
          <h2 className="text-3xl font-bold leading-[1.1] text-[#211734] md:text-[32px]">
            Emprendimientos que están
            <br /> causando un impacto
          </h2>
          <p className="mt-3 text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            Gracias a tu apoyo y la creatividad
            <br className="hidden sm:block" /> de las mujeres emprendedoras de
            esta red.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <span
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ color: item.color, backgroundColor: item.bg }}
                >
                  <Icon className="h-8 w-8" />
                </span>
                <strong className="mt-3 block text-3xl font-bold leading-none text-[#211734] md:text-4xl">
                  {formatStatValue(item.value)}
                </strong>
                <span className="mt-3 block text-xs text-[#6d6383] md:text-sm">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <span className="absolute -right-12 bottom-0 h-24 w-24 rounded-full bg-[#d66eff]" />
    </section>
  );
}

function Categories({ categories }: { categories: HomeCategory[] }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(116deg,#fff_0%,#ffe8df_100%)] py-[72px]">
      <div className="mx-auto max-w-[1224px] px-5 md:px-8 lg:px-0">
        <SectionHeading
          title="Explora por Categorías"
          subtitle="Descubre la diversidad de talento y creatividad en cada categoría"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => {
            const slug = normalizeSlug(category.slug || category.name);
            const fallback =
              fallbackCategories[index % fallbackCategories.length];
            const image = categoryImages[slug] ?? categoryImages[fallback.slug];

            return (
              <Link
                key={`${category.id}-${category.slug}`}
                to={getCategoryHref(category)}
                className="group relative h-[432px] overflow-hidden rounded-[24px] shadow-[0_24px_25px_rgba(13,33,91,0.25)]"
              >
                <img
                  src={image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#7044c9]/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 px-4 py-8 text-white">
                  <h3 className="text-2xl font-bold leading-tight md:text-[32px]">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm md:text-base">
                    {category.productsCount > 0
                      ? `${category.productsCount} producto${category.productsCount === 1 ? "" : "s"}`
                      : "Explorar productos"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_12px_28px_rgba(58,36,103,0.08)]">
      <img
        src={getPublicProductMainImage(product)}
        alt={product.images?.[0]?.altText ?? product.name}
        className="h-64 w-full object-cover sm:h-72"
      />
      <div className="p-5 md:p-6">
        <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#a0b8fb]/20 px-3 py-2 text-xs text-[#698ae5]">
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="truncate">
            Por {getPublicProductEntrepreneurName(product)}
          </span>
        </span>
        <strong className="mt-4 block text-[28px] font-semibold leading-none text-[#3a2467]">
          {formatPublicProductPrice(product)}
        </strong>
        <h3 className="mt-2 line-clamp-2 text-lg text-[#6d6383] md:text-xl">
          {product.name}
        </h3>
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
    <section className="relative overflow-hidden bg-[linear-gradient(122deg,#ffe9e1_0%,#fff_50%,#fff0f4_100%)] py-[72px]">
      <div className="mx-auto max-w-[1224px] px-5 md:px-8 lg:px-0">
        <SectionHeading
          title="Productos Destacados"
          subtitle="Cada pieza es única y lleva consigo una historia de superación"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[440px] animate-pulse rounded-[24px] bg-white/75"
                />
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && products.length === 0 ? (
          <div className="mt-12 rounded-[24px] bg-white/70 px-6 py-12 text-center text-[#6d6383]">
            Aún no hay productos publicados.
          </div>
        ) : null}

        <div className="mt-12 text-center">
          <PrimaryLink to={paths.public.catalog}>
            Explora todos los productos <ArrowRight className="h-5 w-5" />
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="relative overflow-hidden bg-[#3a2467] py-20 text-white">
      <div className="mx-auto grid max-w-[1224px] items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-[72px] lg:px-0">
        <div>
          <img
            src="/home/story.jpg"
            alt="Mujeres emprendedoras"
            className="h-[360px] w-full rounded-[24px] object-cover"
          />
          <div className="mt-6 flex gap-4">
            <span className="flex h-[92px] w-[116px] shrink-0 items-center justify-center rounded-[24px] bg-[#a0b8fb] text-[#3a2467]">
              <Lightbulb className="h-12 w-12" />
            </span>
            <div className="flex flex-1 items-center rounded-[24px] bg-[#fbab8e] px-8 text-[#211734]">
              <strong className="text-2xl leading-none md:text-[32px]">
                Pasión y creatividad
              </strong>
              <Sparkles className="ml-auto hidden h-10 w-10 text-[#d66eff] sm:block" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-medium leading-[1.1] md:text-[40px]">
            Cada compra es un acto de{" "}
            <span className="font-bold text-[#fbab8e]">empoderamiento</span>
          </h2>
          <p className="mt-8 text-lg leading-[1.55] text-white/90 md:text-2xl">
            Al apoyar estos emprendimientos, no solo adquieres productos únicos
            y de calidad, sino que también contribuyes a la transformación de
            vidas y comunidades enteras.
          </p>
          <p className="mt-5 text-lg leading-[1.55] text-white/90 md:text-2xl">
            Cada artículo representa horas de dedicación, talento y la valentía
            de mujeres que han decidido escribir un nuevo capítulo en sus
            historias.
          </p>
          <Link
            to={paths.public.about}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#3a2467] md:text-lg"
          >
            Conoce nuestra historia <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-[linear-gradient(102deg,#ffe3e3_3%,#fffcfc_49%,#f2e3ff_101%)] px-5 py-20 md:px-8">
      <div className="relative mx-auto min-h-[380px] max-w-[1224px] overflow-hidden rounded-[34px] bg-[#a0b8fb] shadow-[0_16px_32px_rgba(58,36,103,0.1)]">
        <img
          src="/home/cta.png"
          alt="Red de mujeres emprendedoras"
          className="absolute inset-y-0 left-0 h-full w-full object-cover object-left opacity-80 lg:w-[52%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a0b8fb]/55 to-[#a0b8fb]" />
        <div className="relative ml-auto flex min-h-[380px] max-w-[800px] flex-col justify-center px-8 py-12 text-white md:px-14 lg:pl-48 lg:pr-24">
          <h2 className="text-3xl font-bold leading-[1.1] md:text-[40px]">
            Una red de mujeres que ya está transformando vidas
          </h2>
          <p className="mt-5 text-lg leading-[1.35] md:text-2xl">
            Estos emprendimientos no son sólo negocios, son evidencia de que el
            talento y la determinación no tienen límites. Al apoyarlos, eres
            parte de algo más grande.
          </p>
          <div className="mt-8">
            <Link
              to={paths.public.catalog}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#7044c9] shadow-[0_12px_12px_rgba(55,19,129,0.1)] md:text-lg"
            >
              Ver catálogo <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
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
          publicProductService.getProducts({ page: 1, limit: 12 }),
          publicBusinessService.getBusinesses({ page: 1, limit: 6 }),
        ]);

        if (!isMounted) return;

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
        if (isMounted) setIsLoading(false);
      }
    }

    void loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const homeCategories = useMemo(
    () => buildHomeCategories(products),
    [products],
  );
  const featuredProducts = useMemo(() => {
    const featured = products.filter((product) => product.isFeatured);
    return (featured.length > 0 ? featured : products).slice(0, 4);
  }, [products]);
  const citiesTotal = useMemo(
    () => getUniqueCitiesCount(entrepreneurs),
    [entrepreneurs],
  );

  return (
    <PublicLayout active="Inicio">
      <main>
        <Hero />

        {homeError ? (
          <div className="bg-amber-50 px-5 py-3 text-center text-sm font-medium text-amber-800">
            {homeError}
          </div>
        ) : null}

        <Impact
          productsTotal={productsTotal}
          entrepreneursTotal={entrepreneursTotal}
          categoriesTotal={homeCategories.length}
          citiesTotal={citiesTotal}
        />
        <Categories categories={homeCategories} />
        <Products products={featuredProducts} isLoading={isLoading} />
        <Story />
        <CallToAction />
      </main>
    </PublicLayout>
  );
}

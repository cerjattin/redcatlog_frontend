import {
  ArrowRight,
  Heart,
  Lightbulb,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/Card";
import { publicBusinessService } from "@/features/public/api/publicBusiness.service";
import { publicProductService } from "@/features/public/api/publicProduct.service";
import { PublicLayout } from "@/features/public/components/PublicLayout";
import type { PublicBusiness } from "@/features/public/types/publicBusiness.types";
import type {
  PublicProduct,
  PublicProductCategory,
} from "@/features/public/types/publicProduct.types";
import {
  getPublicBusinessBannerUrl,
  getPublicBusinessCategoryName,
  getPublicBusinessDescription,
  getPublicBusinessLocation,
  getPublicBusinessLogoUrl,
} from "@/features/public/utils/businessDisplay";
import {
  formatPublicProductPrice,
  getPublicProductMainImage,
} from "@/features/public/utils/productDisplay";
import { paths } from "@/routes/paths";

type HomeCategory = {
  id: string | null;
  title: string;
  subtitle: string;
  image: string;
};

const fallbackCategories: HomeCategory[] = [
  {
    id: null,
    title: "Artesanías",
    subtitle: "Piezas hechas a mano",
    image: "/home/product-1.jpg",
  },
  {
    id: null,
    title: "Gastronomía",
    subtitle: "Sabores tradicionales",
    image: "/home/product-2.jpg",
  },
  {
    id: null,
    title: "Belleza",
    subtitle: "Productos naturales",
    image: "/home/product-3.jpg",
  },
  {
    id: null,
    title: "Moda",
    subtitle: "Diseños únicos",
    image: "/home/product-4.jpg",
  },
];

const categoryImageBySlug: Record<string, string> = {
  artesanias: "/home/category-crafts.jpg",
  gastronomia: "/home/category-food.jpg",
  belleza: "/home/category-beauty.jpg",
  moda: "/home/category-fashion.jpg",
  hogar: "/home/product-1.jpg",
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategoryImage(category: PublicProductCategory) {
  const slug = category.slug || normalizeSlug(category.name);

  return categoryImageBySlug[slug] ?? "/home/product-1.jpg";
}

function buildHomeCategories(products: PublicProduct[]): HomeCategory[] {
  const categoryMap = new Map<string, PublicProductCategory>();

  products.forEach((product) => {
    if (product.category?.id) {
      categoryMap.set(product.category.id, product.category);
    }
  });

  const categories = Array.from(categoryMap.values()).slice(0, 4);

  if (categories.length === 0) {
    return fallbackCategories;
  }

  return categories.map((category) => ({
    id: category.id,
    title: category.name,
    subtitle: "Explora productos de esta categoría",
    image: getCategoryImage(category),
  }));
}

function formatStatValue(value: number) {
  if (value <= 0) {
    return "0";
  }

  return value >= 1000 ? `${Math.floor(value / 100) / 10}k+` : `${value}`;
}

function getUniqueCitiesCount(businesses: PublicBusiness[]) {
  const cities = new Set<string>();

  businesses.forEach((business) => {
    const city = business.city ?? business.entrepreneur?.city;

    if (city) {
      cities.add(city.trim().toLowerCase());
    }
  });

  return cities.size;
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-11 text-center">
      <h2 className="text-3xl font-bold leading-tight text-[#211734] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-3 text-base text-[#6d6383] md:text-xl">{subtitle}</p>
    </div>
  );
}

function PillLink({
  children,
  to,
  light = false,
}: {
  children: ReactNode;
  to: string;
  light?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center rounded-full px-6 py-3.5 text-sm font-bold shadow-[0_10px_20px_rgba(58,36,103,.14)] transition ${
        light
          ? "bg-white text-[#7044c9] hover:bg-[#faf7ff]"
          : "bg-[#211734] text-white hover:bg-[#3a2467]"
      }`}
    >
      {children}
      <ArrowRight size={17} className="ml-2" />
    </Link>
  );
}

function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(115deg,#fff5f6_0%,#fff_48%,#f4e9ff_100%)]"
    >
      <div className="mx-auto grid min-h-[796px] max-w-[1224px] items-center gap-10 px-5 py-16 lg:grid-cols-[.92fr_1.08fr] lg:px-0 lg:py-12">
        <div className="relative z-10">
          <h1 className="max-w-[620px] text-[46px] font-bold leading-[.98] tracking-[-.03em] text-[#3a2467] sm:text-6xl lg:text-[72px]">
            Transformando historias en{" "}
            <span className="text-[#d94673]">oportunidades</span>
          </h1>

          <p className="mt-8 max-w-[560px] text-lg leading-[1.45] text-[#6d6383] md:text-xl">
            Descubre emprendimientos únicos creados por mujeres extraordinarias.
            Cada producto cuenta una historia de resiliencia, creatividad y
            esperanza.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <PillLink to={paths.public.catalog}>
              Explorar catálogo <ShoppingBag size={17} className="ml-2" />
            </PillLink>

            <Link
              to={paths.public.entrepreneurs}
              className="inline-flex items-center rounded-full border border-[#b9aec9] bg-white px-6 py-3.5 text-sm font-semibold text-[#3a2467] shadow-sm transition hover:border-[#d66eff]"
            >
              Conocer emprendimientos
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px]">
          <div className="absolute right-0 top-[22%] h-20 w-20 rounded-[28px] bg-[#ff7da5] opacity-90" />

          <img
            src="/home/hero.png"
            alt="Emprendedora sonriendo"
            className="relative z-10 w-full"
          />

          <div className="absolute bottom-[8%] left-[2%] z-20 rounded-3xl bg-[#d66eff] p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 text-lg font-bold">
              <ShoppingBag size={22} /> Apoya
              <br />
              marcas locales
            </div>

            <div className="mt-3 rounded-full bg-white/25 px-3 py-1 text-xs">
              Hecho 100% colombiano
            </div>
          </div>

          <div className="absolute right-0 top-[43%] z-20 rounded-2xl bg-[#ff9a82] px-4 py-3 text-sm font-bold leading-none text-[#3a2467] shadow-lg">
            Llenas de
            <br />
            creatividad
            <br />y cultura
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 flex items-end gap-3 opacity-80">
        <span className="h-14 w-14 rounded-full bg-[#94aefa]" />
        <span className="h-16 w-20 bg-[#ff9e83]" />
        <span className="h-20 w-20 bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
      </div>
    </section>
  );
}

function Impact({
  productsTotal,
  businessesTotal,
  citiesTotal,
}: {
  productsTotal: number;
  businessesTotal: number;
  citiesTotal: number;
}) {
  const stats = [
    {
      value: formatStatValue(businessesTotal),
      label: "Emprendimientos",
      icon: <UsersRound />,
    },
    {
      value: formatStatValue(productsTotal),
      label: "Productos publicados",
      icon: <Package />,
    },
    {
      value: formatStatValue(businessesTotal),
      label: "Marcas visibles",
      icon: <Heart />,
    },
    {
      value: formatStatValue(citiesTotal),
      label: "Ciudades",
      icon: <MapPin />,
    },
  ];

  return (
    <section className="relative bg-[#fff0f3] py-14">
      <div className="mx-auto grid max-w-[1224px] gap-10 px-5 lg:grid-cols-[1fr_1.6fr] lg:px-0">
        <div>
          <h2 className="text-3xl font-bold leading-tight text-[#211734]">
            Emprendimientos que están
            <br className="hidden sm:block" /> causando un impacto
          </h2>

          <p className="mt-3 text-lg text-[#6d6383]">
            Gracias a tu apoyo y la creatividad
            <br className="hidden sm:block" /> de las mujeres emprendedoras de
            esta red.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#d94673]">
                {stat.icon}
              </span>

              <strong className="mt-3 block text-3xl text-[#211734]">
                {stat.value}
              </strong>

              <span className="text-xs text-[#6d6383]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories({ categories }: { categories: HomeCategory[] }) {
  return (
    <section
      id="categorias"
      className="relative overflow-hidden bg-[#fff8f5] py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Explora por Categorías"
          subtitle="Descubre la diversidad de talento y creatividad en cada categoría"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={`${category.id ?? category.title}`}
              to={paths.public.catalog}
              className="group relative h-[430px] overflow-hidden rounded-[28px] shadow-[0_16px_30px_rgba(58,36,103,.18)]"
            >
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2467]/90 via-transparent to-transparent" />

              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold">{category.title}</h3>
                <p className="mt-1">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function BusinessCard({ business }: { business: PublicBusiness }) {
  const bannerUrl = getPublicBusinessBannerUrl(business);
  const logoUrl = getPublicBusinessLogoUrl(business);
  const categoryName = getPublicBusinessCategoryName(business);
  const location = getPublicBusinessLocation(business);
  const description = getPublicBusinessDescription(business);

  return (
    <Card className="overflow-hidden rounded-[28px] border-0 p-0 shadow-none">
      <div className="relative h-[290px] bg-[#fff0ea]">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={`Banner de ${business.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Store className="h-20 w-20 text-[#ff9f82]" />
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logo de ${business.name}`}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <Store className="h-8 w-8 text-[#d94673]" />
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="rounded-full bg-[#ffe6ec] px-3 py-1 text-[#d94673]">
            {categoryName}
          </span>

          {location ? (
            <span className="flex items-center gap-1 text-[#8e80aa]">
              <MapPin size={12} /> {location}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-2xl font-bold text-[#3a2467]">
          {business.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-[#6d6383]">
          {description}
        </p>

        <Link
          to={paths.public.entrepreneurs}
          className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#3a2467]"
        >
          Ver emprendimiento <ArrowRight size={15} />
        </Link>
      </div>
    </Card>
  );
}

function Entrepreneurs({
  businesses,
  isLoading,
}: {
  businesses: PublicBusiness[];
  isLoading: boolean;
}) {
  return (
    <section id="emprendedoras" className="bg-[#fff4ef] py-20 md:py-24">
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Emprendimientos Destacados"
          subtitle="Conoce las marcas que están transformando vidas a través de su trabajo"
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`business-home-skeleton-${index}`}
                className="overflow-hidden rounded-[28px] bg-white"
              >
                <div className="h-[290px] animate-pulse bg-[#f3edf7]" />
                <div className="space-y-4 p-6">
                  <div className="h-6 w-40 animate-pulse rounded-xl bg-[#f3edf7]" />
                  <div className="h-16 w-full animate-pulse rounded-xl bg-[#f3edf7]" />
                </div>
              </article>
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-white px-6 py-12 text-center text-[#6d6383]">
            Aún no hay emprendimientos publicados.
          </div>
        )}

        <div className="mt-12 text-center">
          <PillLink to={paths.public.entrepreneurs}>
            Conoce todos los emprendimientos
          </PillLink>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: PublicProduct }) {
  const imageUrl = getPublicProductMainImage(product);
  const price = formatPublicProductPrice(product);
  const businessName = product.business?.name ?? "Emprendimiento";

  return (
    <article className="overflow-hidden rounded-[24px] bg-[#fffafb] shadow-[0_10px_24px_rgba(58,36,103,.08)]">
      <img
        src={imageUrl}
        alt={product.images?.[0]?.altText ?? product.name}
        className="h-52 w-full object-cover sm:h-72"
      />

      <div className="p-4">
        <p className="text-xs text-[#8e80aa]">Por {businessName}</p>

        <strong className="mt-3 block text-xl text-[#7044c9]">{price}</strong>

        <p className="mt-1 line-clamp-2 text-sm text-[#6d6383]">
          {product.name}
        </p>
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
    <section id="productos" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
        <SectionHeading
          title="Productos Destacados"
          subtitle="Cada pieza es única y lleva consigo una historia de superación"
        />

        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <article
                key={`product-home-skeleton-${index}`}
                className="overflow-hidden rounded-[24px] bg-[#fffafb]"
              >
                <div className="h-52 animate-pulse bg-[#f3edf7] sm:h-72" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-28 animate-pulse rounded-xl bg-[#f3edf7]" />
                  <div className="h-6 w-20 animate-pulse rounded-xl bg-[#f3edf7]" />
                </div>
              </article>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] bg-[#fffafb] px-6 py-12 text-center text-[#6d6383]">
            Aún no hay productos publicados.
          </div>
        )}

        <div className="mt-12 text-center">
          <PillLink to={paths.public.catalog}>
            Explora todos los productos
          </PillLink>
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section
      id="historia"
      className="relative overflow-hidden bg-[#3a2467] py-20 text-white md:py-24"
    >
      <div className="mx-auto grid max-w-[1224px] items-center gap-14 px-5 lg:grid-cols-2 lg:px-0">
        <div>
          <img
            src="/home/story.jpg"
            alt="Mujeres emprendedoras"
            className="h-[430px] w-full rounded-[28px] object-cover object-[35%_center]"
          />

          <div className="mt-5 flex items-center gap-5 rounded-[22px] bg-[#ff9f82] px-7 py-4 text-[#211734]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#9fb7ff]">
              <Lightbulb size={30} />
            </span>

            <strong className="text-2xl">
              Pasión y
              <br />
              creatividad
            </strong>

            <Sparkles className="ml-auto text-[#d66eff]" size={38} />
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            Cada compra es un acto de{" "}
            <span className="text-[#ff9f82]">empoderamiento</span>
          </h2>

          <p className="mt-7 text-lg leading-relaxed text-white/90">
            Al apoyar estos emprendimientos, no solo adquieres productos únicos
            y de calidad, sino que también contribuyes a la transformación de
            vidas y comunidades enteras.
          </p>

          <p className="mt-5 text-lg leading-relaxed text-white/90">
            Cada artículo representa horas de dedicación, talento y la valentía
            de mujeres que han decidido escribir un nuevo capítulo en sus
            historias.
          </p>

          <div className="mt-8">
            <PillLink to={paths.public.about} light>
              Conoce nuestra historia
            </PillLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="bg-[linear-gradient(110deg,#ffe3e3,#fff,#f2e3ff)] px-5 py-20 md:py-24">
      <div className="relative mx-auto grid max-w-[1224px] overflow-hidden rounded-[34px] bg-[#9fb7ff] shadow-[0_18px_40px_rgba(58,36,103,.16)] lg:grid-cols-[.9fr_1.1fr]">
        <img
          src="/home/cta.png"
          alt="Red de mujeres emprendedoras"
          className="h-full min-h-[330px] w-full object-cover"
        />

        <div className="relative flex flex-col justify-center p-8 text-white md:p-12">
          <h2 className="text-3xl font-bold leading-tight md:text-[40px]">
            Una red de mujeres que ya está transformando vidas
          </h2>

          <p className="mt-5 text-lg leading-relaxed">
            Estos emprendimientos no son sólo negocios, son evidencia de que el
            talento y la determinación no tienen límites. Al apoyarlos, eres
            parte de algo más grande.
          </p>

          <div className="mt-7">
            <PillLink to={paths.public.catalog} light>
              Ver catálogo
            </PillLink>
          </div>

          <div className="absolute bottom-0 right-0 flex items-end gap-2">
            <span className="h-14 w-8 rounded-t-full bg-[#ff7da5]" />
            <span className="h-14 w-16 bg-[#ff9f82]" />
            <span className="h-14 w-16 bg-[#d66eff] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [businesses, setBusinesses] = useState<PublicBusiness[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const [businessesTotal, setBusinessesTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        setIsLoading(true);
        setHomeError(null);

        const [productsResponse, businessesResponse] = await Promise.all([
          publicProductService.getProducts({
            page: 1,
            limit: 100,
          }),
          publicBusinessService.getBusinesses({
            page: 1,
            limit: 100,
          }),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productsResponse.products);
        setBusinesses(businessesResponse.businesses);
        setProductsTotal(productsResponse.pagination.total);
        setBusinessesTotal(businessesResponse.pagination.total);
      } catch {
        if (!isMounted) {
          return;
        }

        setProducts([]);
        setBusinesses([]);
        setProductsTotal(0);
        setBusinessesTotal(0);
        setHomeError(
          "No fue posible cargar la información pública desde el backend.",
        );
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

  const homeCategories = useMemo(
    () => buildHomeCategories(products),
    [products],
  );
  const featuredProducts = products.slice(0, 4);
  const featuredBusinesses = businesses.slice(0, 3);
  const citiesTotal = getUniqueCitiesCount(businesses);

  return (
    <PublicLayout active="Inicio">
      <main>
        <Hero />

        {homeError ? (
          <div className="bg-red-50 px-5 py-3 text-center text-sm font-medium text-red-700">
            {homeError}
          </div>
        ) : null}

        <Impact
          productsTotal={productsTotal}
          businessesTotal={businessesTotal}
          citiesTotal={citiesTotal}
        />

        <Categories categories={homeCategories} />

        <Entrepreneurs businesses={featuredBusinesses} isLoading={isLoading} />

        <Products products={featuredProducts} isLoading={isLoading} />

        <Story />
        <CallToAction />
      </main>
    </PublicLayout>
  );
}

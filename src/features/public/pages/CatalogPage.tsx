import axios from "axios";
import {
  AlertCircle,
  MessageCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { PublicPagination } from "@/features/public/components/PublicPagination";
import { publicProductService } from "@/features/public/api/publicProduct.service";
import {
  PublicFooter,
  PublicHeader,
} from "@/features/public/components/PublicLayout";
import { PublicSocialLinks } from "@/features/public/components/PublicSocialLinks";
import type {
  PublicProduct,
  PublicProductCategory,
  PublicProductsPagination,
} from "@/features/public/types/publicProduct.types";
import { buildWhatsappUrl } from "@/features/public/utils/whatsapp";
import {
  formatPublicProductPrice,
  getPublicProductEntrepreneurName,
  getPublicProductLocation,
  getPublicProductMainImage,
  getPublicProductWhatsappPhone,
  isPublicProductOutOfStock,
} from "@/features/public/utils/productDisplay";
import { cn } from "@/utils/cn";

const PAGE_SIZE = 12;

type CategoryFilter = {
  id: string | null;
  name: string;
};

function getApiErrorMessage(error: unknown) {
  console.error("Error cargando catálogo público:", error);

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string } | undefined;

    if (!error.response) {
      return "No hay conexión con el backend. Verifica que el servidor esté corriendo en http://localhost:4000.";
    }

    return (
      data?.message ??
      `No fue posible cargar el catálogo. Código HTTP: ${status}.`
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible cargar el catálogo.";
}

function getUniqueCategories(products: PublicProduct[]) {
  const categoryMap = new Map<string, PublicProductCategory>();

  products.forEach((product) => {
    if (product.category?.id) {
      categoryMap.set(product.category.id, product.category);
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "es"),
  );
}

function CatalogHero() {
  return (
    <section className="px-5 pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto flex max-w-[1224px] flex-col items-center justify-center gap-7 text-center md:flex-row md:text-left">
        <img
          src="/catalog/catalog-hero.png"
          alt=""
          className="h-[190px] w-[230px] object-contain md:h-[230px] md:w-[270px]"
        />

        <div className="min-w-0 max-w-full">
          <h1 className="max-w-full break-words text-[38px] font-bold leading-tight text-[#211734] sm:text-5xl md:text-[56px]">
            Catálogo de productos
          </h1>

          <p className="mt-3 text-lg text-[#6d6383] md:text-2xl">
            Descubre productos únicos hechos con amor y dedicación
          </p>
        </div>
      </div>
    </section>
  );
}

function CatalogControls({
  query,
  categories,
  selectedCategoryId,
  isCategoryLoading,
  onQueryChange,
  onSearch,
  onCategoryChange,
  onClearFilters,
}: {
  query: string;
  categories: CategoryFilter[];
  selectedCategoryId: string | null;
  isCategoryLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onCategoryChange: (value: string | null) => void;
  onClearFilters: () => void;
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
            placeholder="Buscar productos, marcas o emprendedoras..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8e80aa]"
          />
        </label>

        <button
          type="submit"
          className="hidden h-14 items-center gap-3 rounded-full border border-[#cfc5df] bg-white px-6 text-sm font-medium text-[#6d6383] transition hover:border-[#d66eff] hover:text-[#3a2467] sm:flex"
        >
          Buscar
          <SlidersHorizontal size={21} />
        </button>
      </form>

      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isCategoryLoading ? (
          <span className="rounded-full border border-[#cfc5df] bg-white px-6 py-3 text-sm font-medium text-[#6d6383]">
            Cargando categorías...
          </span>
        ) : (
          categories.map((item) => (
            <button
              key={item.id ?? "all"}
              type="button"
              onClick={() => onCategoryChange(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-6 py-3 text-sm font-medium transition",
                selectedCategoryId === item.id
                  ? "border-[#ff9f82] bg-[#ff9f82] text-white"
                  : "border-[#cfc5df] bg-white text-[#6d6383] hover:border-[#d66eff]",
              )}
            >
              {item.name}
            </button>
          ))
        )}

        <button
          type="button"
          onClick={onClearFilters}
          className="shrink-0 rounded-full border border-[#cfc5df] bg-white px-6 py-3 text-sm font-medium text-[#6d6383] transition hover:border-[#d66eff]"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: PublicProduct }) {
  const imageUrl = getPublicProductMainImage(product);
  const price = formatPublicProductPrice(product);
  const entrepreneurName = getPublicProductEntrepreneurName(product);
  const location = getPublicProductLocation(product);
  const whatsappPhone = getPublicProductWhatsappPhone(product);
  const whatsappUrl = buildWhatsappUrl({
    phone: whatsappPhone,
    productName: product.name,
    businessName: entrepreneurName,
  });
  const isOutOfStock = isPublicProductOutOfStock(product);

  return (
    <article className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(58,36,103,0.08)]">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.images?.[0]?.altText ?? product.name}
          className="h-[240px] w-full object-cover sm:h-[288px]"
        />

        {product.category?.name ? (
          <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#3a2467] shadow-sm">
            {product.category.name}
          </span>
        ) : null}

        {isOutOfStock ? (
          <span className="absolute right-5 top-5 rounded-full bg-[#211734] px-4 py-2 text-xs font-semibold text-white shadow-sm">
            Agotado
          </span>
        ) : null}
      </div>

      <div className="px-6 pb-8 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#a0b8fb]/20 px-3 py-2 text-sm text-[#698ae5]">
          <ShoppingCart size={15} />
          Por {entrepreneurName || "REDMUEMMA"}
        </span>

        <strong className="mt-4 block text-[28px] font-semibold leading-none text-[#3a2467]">
          {price}
        </strong>

        <h2 className="mt-2 text-xl font-semibold text-[#211734]">
          {product.name}
        </h2>

        {product.shortDescription ? (
          <p className="mt-3 text-sm leading-6 text-[#6d6383]">
            {product.shortDescription}
          </p>
        ) : null}

        <div className="mt-4 space-y-1 text-sm text-[#8e80aa]">
          <p>Emprendedora: {entrepreneurName}</p>

          {location ? <p>{location}</p> : null}
        </div>

        <PublicSocialLinks
          className="mt-5"
          itemClassName="h-9 min-w-9 px-0 text-[#6d6383]"
          facebookUrl={product.entrepreneur?.facebookUrl}
          instagramUrl={product.entrepreneur?.instagramUrl}
          tiktokUrl={product.entrepreneur?.tiktokUrl}
        />

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#35c46a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2ead5c]"
          >
            <MessageCircle className="h-5 w-5" />
            Consultar por WhatsApp
          </a>
        ) : (
          <div className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6d6383]/15 px-5 py-3 text-sm font-bold text-[#6d6383]">
            Contacto no disponible
          </div>
        )}
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white">
      <div className="h-[240px] animate-pulse bg-[#f3edf7] sm:h-[288px]" />

      <div className="space-y-4 px-6 pb-8 pt-6">
        <div className="h-9 w-40 animate-pulse rounded-full bg-[#f3edf7]" />
        <div className="h-8 w-28 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-6 w-52 animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-16 w-full animate-pulse rounded-xl bg-[#f3edf7]" />
        <div className="h-12 w-full animate-pulse rounded-full bg-[#f3edf7]" />
      </div>
    </article>
  );
}

export function CatalogPage() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<PublicProduct[]>([]);
  const [pagination, setPagination] = useState<PublicProductsPagination | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = useMemo<CategoryFilter[]>(() => {
    const sourceProducts =
      categoryProducts.length > 0 ? categoryProducts : products;

    return [
      {
        id: null,
        name: "Todos los productos",
      },
      ...getUniqueCategories(sourceProducts).map((category) => ({
        id: category.id,
        name: category.name,
      })),
    ];
  }, [categoryProducts, products]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsCategoryLoading(true);

        const data = await publicProductService.getProducts({
          page: 1,
          limit: 100,
        });

        if (!isMounted) {
          return;
        }

        setCategoryProducts(data.products);
      } catch {
        if (!isMounted) {
          return;
        }

        setCategoryProducts([]);
      } finally {
        if (isMounted) {
          setIsCategoryLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await publicProductService.getProducts({
          page,
          limit: PAGE_SIZE,
          search: searchTerm || undefined,
          categoryId: selectedCategoryId || undefined,
        });

        if (!isMounted) {
          return;
        }

        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(getApiErrorMessage(error));
        setProducts([]);
        setPagination(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [page, searchTerm, selectedCategoryId]);

  function handleSearch() {
    setPage(1);
    setSearchTerm(query.trim());
  }

  function handleCategoryChange(categoryId: string | null) {
    setPage(1);
    setSelectedCategoryId(categoryId);
  }

  function handleClearFilters() {
    setQuery("");
    setSearchTerm("");
    setSelectedCategoryId(null);
    setPage(1);
  }

  const currentPage = pagination?.page ?? page;
  const totalPages = pagination?.totalPages ?? 1;
  const totalProducts = pagination?.total ?? products.length;

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active="Catálogo" />

      <main className="relative overflow-hidden bg-[linear-gradient(135deg,#fff9fa_0%,#fff_46%,#fff0ea_100%)]">
        <CatalogHero />

        <CatalogControls
          query={query}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isCategoryLoading={isCategoryLoading}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onClearFilters={handleClearFilters}
        />

        <section className="mx-auto max-w-[1224px] px-5 pt-8 lg:px-0">
          <p className="mb-4 text-base font-medium text-[#6d6383]">
            Mostrando {products.length} productos de {totalProducts}
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
                <ProductCardSkeleton key={`product-skeleton-${index}`} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">
              No encontramos productos para esta búsqueda.
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

        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-tr-full border-[24px] border-b-0 border-l-0 border-[#ffcab9]/70" />

        <div className="pointer-events-none absolute bottom-0 right-0 flex items-end">
          <span className="h-20 w-20 rounded-full bg-[#dcbdd8]" />
          <span className="h-20 w-20 bg-[#dcbdd8] [clip-path:polygon(0_0,100%_100%,0_100%)]" />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

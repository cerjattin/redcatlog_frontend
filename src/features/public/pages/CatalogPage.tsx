import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { useMemo, useState } from "react";

import { PublicPagination } from "@/features/public/components/PublicPagination";
import { PublicFooter, PublicHeader } from "@/features/public/pages/HomePage";
import { cn } from "@/utils/cn";

type Category = "Todos los productos" | "Artesanías" | "Gastronomía" | "Belleza" | "Moda";

type CatalogProduct = {
  category: Exclude<Category, "Todos los productos">;
  brand: string;
  name: string;
  price: string;
  image: string;
};

const baseProducts: CatalogProduct[] = [
  { category: "Artesanías", brand: "Joyas del corazón", name: "Collar Artesanal", price: "$45.000", image: "/catalog/product-collar.jpg" },
  { category: "Gastronomía", brand: "Raíces creativas", name: "Bolso Tejido", price: "$85.000", image: "/catalog/product-bag.jpg" },
  { category: "Belleza", brand: "Colores del alma", name: "Pulseras Coloridas", price: "$25.000", image: "/catalog/product-bracelets.jpg" },
  { category: "Moda", brand: "Tejiendo Sueños", name: "Textil Tradicional", price: "$120.000", image: "/catalog/product-textile.jpg" },
  { category: "Belleza", brand: "Esencia Natural", name: "Joyería Única", price: "$55.000", image: "/catalog/product-jewelry.jpg" },
  { category: "Artesanías", brand: "Sabor a Casa", name: "Cerámica Pintada", price: "$35.000", image: "/catalog/product-ceramic.jpg" },
];

const products = [...baseProducts, ...baseProducts].map((product, index) => ({
  ...product,
  id: `${product.name}-${index}`,
}));

const categories: Category[] = ["Todos los productos", "Artesanías", "Gastronomía", "Belleza", "Moda"];

function CatalogHero() {
  return (
    <section className="px-5 pb-14 pt-12 md:pb-20 md:pt-16">
      <div className="mx-auto flex max-w-[1224px] flex-col items-center justify-center gap-7 text-center md:flex-row md:text-left">
        <img src="/catalog/catalog-hero.png" alt="" className="h-[190px] w-[230px] object-contain md:h-[230px] md:w-[270px]" />
        <div className="min-w-0 max-w-full">
          <h1 className="max-w-full break-words text-[38px] font-bold leading-tight text-[#211734] sm:text-5xl md:text-[56px]">Catálogo de productos</h1>
          <p className="mt-3 text-lg text-[#6d6383] md:text-2xl">Descubre productos únicos hechos con amor y dedicación</p>
        </div>
      </div>
    </section>
  );
}

function CatalogControls({ query, category, onQueryChange, onCategoryChange }: {
  query: string;
  category: Category;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: Category) => void;
}) {
  return (
    <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
      <div className="flex gap-4">
        <label className="flex h-14 flex-1 items-center gap-4 rounded-full border border-[#cfc5df] bg-white px-5 text-[#6d6383]">
          <Search size={22} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar emprendedoras o marcas..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8e80aa]" />
        </label>
        <button className="hidden h-14 items-center gap-3 rounded-full border border-[#cfc5df] bg-white px-6 text-sm font-medium text-[#6d6383] sm:flex">Filtros <SlidersHorizontal size={21} /></button>
      </div>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => (
          <button key={item} onClick={() => onCategoryChange(item)} className={cn("shrink-0 rounded-full border px-6 py-3 text-sm font-medium transition", category === item ? "border-[#ff9f82] bg-[#ff9f82] text-white" : "border-[#cfc5df] bg-white text-[#6d6383] hover:border-[#d66eff]")}>{item}</button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white">
      <img src={product.image} alt={product.name} className="h-[240px] w-full object-cover sm:h-[288px]" />
      <div className="px-6 pb-8 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#a0b8fb]/20 px-3 py-2 text-sm text-[#698ae5]"><ShoppingCart size={15} /> Por {product.brand}</span>
        <strong className="mt-4 block text-[28px] font-semibold leading-none text-[#3a2467]">{product.price}</strong>
        <p className="mt-2 text-xl text-[#6d6383]">{product.name}</p>
      </div>
    </article>
  );
}

export function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todos los productos");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return products.filter((product) => {
      const matchesCategory = category === "Todos los productos" || product.category === category;
      const matchesQuery = !normalizedQuery || `${product.brand} ${product.name}`.toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active="Catálogo" />
      <main className="relative overflow-hidden bg-[linear-gradient(135deg,#fff9fa_0%,#fff_46%,#fff0ea_100%)]">
        <CatalogHero />
        <CatalogControls query={query} category={category} onQueryChange={setQuery} onCategoryChange={setCategory} />
        <section className="mx-auto max-w-[1224px] px-5 pt-8 lg:px-0">
          <p className="mb-4 text-base font-medium text-[#6d6383]">Mostrando {visibleProducts.length} productos de 40</p>
          {visibleProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          ) : (
            <div className="rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">No encontramos productos para esta búsqueda.</div>
          )}
          <PublicPagination />
        </section>
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-tr-full border-[24px] border-b-0 border-l-0 border-[#ffcab9]/70" />
        <div className="pointer-events-none absolute bottom-0 right-0 flex items-end"><span className="h-20 w-20 rounded-full bg-[#dcbdd8]" /><span className="h-20 w-20 bg-[#dcbdd8] [clip-path:polygon(0_0,100%_100%,0_100%)]" /></div>
      </main>
      <PublicFooter />
    </div>
  );
}

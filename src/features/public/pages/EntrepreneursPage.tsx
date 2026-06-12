import { MapPin, Search, SlidersHorizontal, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { PublicPagination } from "@/features/public/components/PublicPagination";
import { PublicFooter, PublicHeader } from "@/features/public/pages/HomePage";
import { cn } from "@/utils/cn";

type Category = "Todas las emprendedoras" | "Artesanías" | "Gastronomía" | "Belleza" | "Moda";

type Entrepreneur = {
  category: Exclude<Category, "Todas las emprendedoras">;
  city: string;
  name: string;
  description: string;
  products: number;
  image: string;
};

const entrepreneurs: Entrepreneur[] = [
  { category: "Artesanías", city: "Bogotá", name: "Hilos de Esperanza", description: "Tejidos tradicionales que cuentan historias de superación y creatividad.", products: 45, image: "/entrepreneurs/hilos-esperanza.jpg" },
  { category: "Gastronomía", city: "Medellín", name: "Raíces Creativas", description: "Sabores tradicionales preparados con recetas de familia y mucho amor.", products: 32, image: "/entrepreneurs/raices-creativas.jpg" },
  { category: "Belleza", city: "Cali", name: "Esencia Natural", description: "Productos de belleza naturales elaborados con ingredientes orgánicos.", products: 28, image: "/entrepreneurs/esencia-natural.jpg" },
  { category: "Artesanías", city: "Cartagena", name: "Colores del Alma", description: "Cerámicas pintadas a mano con diseños únicos inspirados en la costa.", products: 52, image: "/entrepreneurs/colores-alma.jpg" },
  { category: "Moda", city: "Bucaramanga", name: "Tejiendo Sueños", description: "Moda sostenible con textiles tradicionales y diseños contemporáneos.", products: 38, image: "/entrepreneurs/tejiendo-suenos.jpg" },
  { category: "Belleza", city: "Barranquilla", name: "Joyas del Corazón", description: "Joyería artesanal hecha con materiales de joyas y piedras naturales.", products: 41, image: "/entrepreneurs/joyas-corazon.jpg" },
  { category: "Artesanías", city: "Pereira", name: "Sabor de Casa", description: "Productos gastronómicos artesanales que rescatan tradiciones culinarias.", products: 25, image: "/entrepreneurs/sabor-casa.jpg" },
  { category: "Artesanías", city: "Manizales", name: "Arte en Madera", description: "Decoración en madera tallada a mano con motivos tradicionales.", products: 36, image: "/entrepreneurs/arte-madera.jpg" },
  { category: "Artesanías", city: "Santa Marta", name: "Canastas y Más", description: "Productos tejidos en fibras naturales para el hogar.", products: 44, image: "/entrepreneurs/canastas-mas.jpg" },
];

const categories: Category[] = ["Todas las emprendedoras", "Artesanías", "Gastronomía", "Belleza", "Moda"];

function EntrepreneursHero() {
  return (
    <section className="px-5 pb-14 pt-10 md:pb-14 md:pt-6">
      <div className="mx-auto flex max-w-[960px] flex-col items-center justify-center gap-7 text-center md:flex-row md:text-left">
        <img src="/entrepreneurs/entrepreneurs-hero.png" alt="" className="h-[185px] w-[245px] object-contain md:h-[230px] md:w-[285px]" />
        <div>
          <h1 className="text-[42px] font-bold leading-tight text-[#211734] sm:text-5xl md:text-[56px]">Emprendedoras</h1>
          <p className="mt-3 max-w-[650px] text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            Conoce las marcas y negocios de mujeres extraordinarias que están transformando sus vidas
          </p>
        </div>
      </div>
    </section>
  );
}

function EntrepreneursControls({ query, category, onQueryChange, onCategoryChange }: {
  query: string;
  category: Category;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: Category) => void;
}) {
  return (
    <div className="mx-auto max-w-[1224px] px-5 lg:px-0">
      <div className="flex gap-4">
        <label className="flex h-14 flex-1 items-center gap-4 rounded-full border border-[#cfc5df] bg-white px-5 text-[#3a2467]">
          <Search size={22} />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar emprendedoras o marcas..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#8e80aa]" />
        </label>
        <button type="button" className="hidden h-14 items-center gap-3 rounded-full border border-[#cfc5df] bg-white px-6 text-sm font-medium text-[#6d6383] sm:flex">
          Filtros <SlidersHorizontal size={21} />
        </button>
      </div>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => (
          <button key={item} type="button" onClick={() => onCategoryChange(item)} className={cn("shrink-0 rounded-full border px-6 py-3 text-sm font-medium transition", category === item ? "border-[#ff9f82] bg-[#ff9f82] text-white" : "border-[#cfc5df] bg-white text-[#6d6383] hover:border-[#d66eff]")}>{item}</button>
        ))}
      </div>
    </div>
  );
}

function EntrepreneurCard({ entrepreneur }: { entrepreneur: Entrepreneur }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white">
      <img src={entrepreneur.image} alt={entrepreneur.name} className="h-[240px] w-full object-cover sm:h-[288px]" />
      <div className="flex min-h-[230px] flex-col px-6 pb-8 pt-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-[#ff88ac]/20 px-3 py-1.5 text-[#d14e75]">{entrepreneur.category}</span>
          <span className="flex items-center gap-1.5 text-[#698ae5]"><MapPin size={15} /> {entrepreneur.city}</span>
        </div>
        <h2 className="mt-3 text-[25px] font-semibold leading-tight text-[#3a2467] md:text-[28px]">{entrepreneur.name}</h2>
        <p className="mt-2 text-base leading-[1.35] text-[#6d6383]">{entrepreneur.description}</p>
        <p className="mt-auto flex items-center gap-2 pt-5 text-base text-[#ff709b]"><Tag size={15} /> {entrepreneur.products} productos disponibles</p>
      </div>
    </article>
  );
}

export function EntrepreneursPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todas las emprendedoras");

  const visibleEntrepreneurs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return entrepreneurs.filter((entrepreneur) => {
      const matchesCategory = category === "Todas las emprendedoras" || entrepreneur.category === category;
      const matchesQuery = !normalizedQuery || `${entrepreneur.name} ${entrepreneur.city} ${entrepreneur.description}`.toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active="Emprendedoras" />
      <main className="relative overflow-hidden bg-[linear-gradient(135deg,#fff9fa_0%,#fff_46%,#fff0ea_100%)]">
        <EntrepreneursHero />
        <EntrepreneursControls query={query} category={category} onQueryChange={setQuery} onCategoryChange={setCategory} />
        <section className="mx-auto max-w-[1224px] px-5 pt-8 lg:px-0">
          <p className="mb-4 text-base font-medium text-[#6d6383]">Mostrando {visibleEntrepreneurs.length === entrepreneurs.length ? 12 : visibleEntrepreneurs.length} emprendedoras de 40</p>
          {visibleEntrepreneurs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visibleEntrepreneurs.map((entrepreneur) => <EntrepreneurCard key={entrepreneur.name} entrepreneur={entrepreneur} />)}</div>
          ) : (
            <div className="rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">No encontramos emprendedoras para esta búsqueda.</div>
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

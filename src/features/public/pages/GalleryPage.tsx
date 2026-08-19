import { ChevronDown, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PublicFooter, PublicHeader } from "@/features/public/components/PublicLayout";
import { galleryItems } from "@/features/public/data/gallery.generated";
import { cn } from "@/utils/cn";

type GalleryFilter = "Todo" | "Fotos" | "Videos" | "Historias" | "Territorios";
type GalleryKind = "photo" | "video" | "story" | "territory";

type GalleryItem = {
  id: number;
  image: string;
  alt: string;
  kind: GalleryKind;
  height: number;
};

const filters: GalleryFilter[] = ["Todo", "Fotos", "Videos", "Historias", "Territorios"];
const allGalleryItems = galleryItems as readonly GalleryItem[];

function GalleryHero() {
  return (
    <section className="px-5 pb-14 pt-8 md:pb-14 md:pt-8">
      <div className="mx-auto flex max-w-[920px] flex-col items-center justify-center gap-7 text-center md:flex-row md:gap-12 md:text-left">
        <img src="/gallery/gallery-hero.png" alt="" className="h-[190px] w-[230px] object-contain md:h-[214px] md:w-[239px]" />
        <div>
          <h1 className="text-[42px] font-semibold leading-[1.1] text-[#211734] sm:text-5xl md:text-[52px]">Galería</h1>
          <p className="mt-4 max-w-[680px] text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            Explora imagenes de nuestros productos, talleres y el proceso creativo de nuestras emprendedoras
          </p>
        </div>
      </div>
    </section>
  );
}

function GalleryControls({
  query,
  filter,
  onQueryChange,
  onFilterChange,
}: {
  query: string;
  filter: GalleryFilter;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: GalleryFilter) => void;
}) {
  return (
    <section className="mx-auto max-w-[1224px] px-5 lg:px-0">
      <label className="flex h-14 items-center gap-3 rounded-full border border-[#d2c9e5] bg-white px-4 text-[#3a2467]">
        <Search size={22} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar fotos, eventos, videos..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[#6d6383] outline-none placeholder:text-[#6d6383]"
        />
      </label>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onFilterChange(item)}
            className={cn(
              "min-w-[132px] shrink-0 rounded-full border px-6 py-3.5 text-sm font-medium transition",
              filter === item
                ? "border-[#fbab8e] bg-[#fbab8e] font-semibold text-white"
                : "border-[#d2c9e5] bg-white text-[#6d6383] hover:border-[#d66eff]",
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  );
}

function GalleryCard({ item, responsive = false }: { item: GalleryItem; responsive?: boolean }) {
  return (
    <article
      className={cn("group relative break-inside-avoid overflow-hidden rounded-[24px] bg-white", responsive && "h-[360px] sm:h-[430px]")}
      style={responsive ? undefined : { height: item.height }}
    >
      <img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      {item.kind === "video" && (
        <span className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white md:h-[120px] md:w-[120px]">
          <Play className="ml-1 fill-white" size={48} aria-hidden="true" />
          <span className="sr-only">Reproducir video</span>
        </span>
      )}
    </article>
  );
}

function GalleryGrid({ items }: { items: readonly GalleryItem[] }) {
  const filteredColumns = [0, 1, 2].map((columnIndex) => items.filter((_, itemIndex) => itemIndex % 3 === columnIndex));

  return (
    <section className="mx-auto max-w-[1224px] px-5 pt-8 lg:px-0">
      <div className="grid gap-6 sm:grid-cols-2 lg:hidden">
        {items.map((item) => <GalleryCard key={item.id} item={item} responsive />)}
      </div>
      <div className="hidden grid-cols-3 items-start gap-6 lg:grid">
        {filteredColumns.map((column, index) => (
          <div key={index} className="flex flex-col gap-6">
            {column.map((item) => <GalleryCard key={item.id} item={item} />)}
          </div>
        ))}
      </div>
    </section>
  );
}

export function GalleryPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<GalleryFilter>("Todo");

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    const filterKind: Record<Exclude<GalleryFilter, "Todo">, GalleryKind> = {
      Fotos: "photo",
      Videos: "video",
      Historias: "story",
      Territorios: "territory",
    };

    return allGalleryItems.filter((item) => {
      const matchesFilter = filter === "Todo" || item.kind === filterKind[filter];
      const matchesQuery = !normalizedQuery || item.alt.toLocaleLowerCase("es").includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#211734]">
      <PublicHeader active="Galería" />
      <main className="relative overflow-hidden bg-[linear-gradient(134deg,#ffe9f0_0%,#fff_48%,#ffe8df_100%)] pb-20">
        <GalleryHero />
        <GalleryControls query={query} filter={filter} onQueryChange={setQuery} onFilterChange={setFilter} />
        {visibleItems.length > 0 ? (
          <GalleryGrid items={visibleItems} />
        ) : (
          <div className="mx-auto mt-8 max-w-[1224px] rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">No encontramos contenido para esta busqueda.</div>
        )}
        <div className="flex justify-center py-12">
          <button type="button" className="flex min-w-[140px] items-center justify-center gap-2 rounded-full border border-[#6d6383] px-6 py-3.5 text-lg font-bold text-[#6d6383] transition hover:bg-white/70">
            Ve mas <ChevronDown size={24} />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-tr-full border-[24px] border-b-0 border-l-0 border-[#ffcab9]/70" />
        <div className="pointer-events-none absolute bottom-0 right-0 flex items-end"><span className="h-20 w-20 rounded-full bg-[#dcbdd8]" /><span className="h-20 w-20 bg-[#dcbdd8] [clip-path:polygon(0_0,100%_100%,0_100%)]" /></div>
      </main>
      <PublicFooter />
    </div>
  );
}

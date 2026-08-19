import { ChevronDown, Play, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PublicFooter, PublicHeader } from "@/features/public/components/PublicLayout";
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

const galleryColumns: GalleryItem[][] = [
  [
    { id: 1, image: "/gallery/gallery-01.jpg", alt: "Mujeres emprendedoras compartiendo", kind: "story", height: 432 },
    { id: 2, image: "/gallery/gallery-02.jpg", alt: "Joyería artesanal", kind: "photo", height: 490 },
    { id: 3, image: "/gallery/gallery-03.jpg", alt: "Feria de emprendimientos", kind: "video", height: 697 },
    { id: 4, image: "/gallery/gallery-04.jpg", alt: "Proceso de tejido artesanal", kind: "photo", height: 314 },
  ],
  [
    { id: 5, image: "/gallery/gallery-05.jpg", alt: "Arreglo floral artesanal", kind: "video", height: 697 },
    { id: 6, image: "/gallery/gallery-06.jpg", alt: "Preparación de alimentos", kind: "photo", height: 314 },
    { id: 7, image: "/gallery/gallery-07.jpg", alt: "Taller creativo", kind: "story", height: 432 },
    { id: 8, image: "/gallery/gallery-08.jpg", alt: "Gastronomía artesanal", kind: "photo", height: 490 },
  ],
  [
    { id: 9, image: "/gallery/gallery-09.jpg", alt: "Textiles de colores", kind: "photo", height: 490 },
    { id: 10, image: "/gallery/gallery-10.jpg", alt: "Máquina de coser", kind: "photo", height: 314 },
    { id: 11, image: "/gallery/gallery-11.jpg", alt: "Colección de moda", kind: "story", height: 697 },
    { id: 12, image: "/gallery/gallery-12.jpg", alt: "Proceso de cerámica", kind: "video", height: 432 },
  ],
];

const filters: GalleryFilter[] = ["Todo", "Fotos", "Videos", "Historias", "Territorios"];

const territoryPhotos = [
  {
    src: "/gallery/gallery-13.webp",
    alt: "Atardecer sobre los Montes de Maria",
  },
  {
    src: "/gallery/gallery-14.jpg",
    alt: "Iglesia rodeada de montanas y vegetacion",
  },
  {
    src: "/gallery/gallery-15.webp",
    alt: "Puesta de sol sobre montanas y flores",
  },
  {
    src: "/gallery/gallery-16.jpg",
    alt: "Mirador natural con flores y montanas verdes",
  },
  {
    src: "/gallery/gallery-17.jpeg",
    alt: "Vista panoramica de un pueblo entre montanas",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.24.jpeg",
    alt: "Camino rural entre cultivos y montes de la region",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.26.jpeg",
    alt: "Paisaje de colinas y vegetacion de los Montes de Maria",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.28.jpeg",
    alt: "Laderas verdes y cielo abierto en zona rural",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.29.jpeg",
    alt: "Cercas y montanas de una comunidad rural",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.30.jpeg",
    alt: "Paisaje campesino con montanas y camino destapado",
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-07-31%20at%2017.22.32.jpeg",
    alt: "Carretera rural rodeada de cultivos y colinas",
  },
];

const territoryItems: GalleryItem[] = territoryPhotos.map((photo, index) => ({
  id: 13 + index,
  image: photo.src,
  alt: photo.alt,
  kind: "territory",
  height: [360, 432, 314, 432, 314, 520, 490, 520, 490, 432, 432][index] ?? 432,
}));

const allGalleryItems = [...galleryColumns.flat(), ...territoryItems];

function GalleryHero() {
  return (
    <section className="px-5 pb-14 pt-8 md:pb-14 md:pt-8">
      <div className="mx-auto flex max-w-[920px] flex-col items-center justify-center gap-7 text-center md:flex-row md:gap-12 md:text-left">
        <img src="/gallery/gallery-hero.png" alt="" className="h-[190px] w-[230px] object-contain md:h-[214px] md:w-[239px]" />
        <div>
          <h1 className="text-[42px] font-semibold leading-[1.1] text-[#211734] sm:text-5xl md:text-[52px]">Galería</h1>
          <p className="mt-4 max-w-[680px] text-lg leading-[1.35] text-[#6d6383] md:text-2xl">
            Explora imágenes de nuestros productos, talleres y el proceso creativo de nuestras emprendedoras
          </p>
        </div>
      </div>
    </section>
  );
}

function GalleryControls({ query, filter, onQueryChange, onFilterChange }: {
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
      <img src={item.image} alt={item.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
      {item.kind === "video" && (
        <span className="absolute left-1/2 top-1/2 flex h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white md:h-[120px] md:w-[120px]">
          <Play className="ml-1 fill-white" size={48} aria-hidden="true" />
          <span className="sr-only">Reproducir video</span>
        </span>
      )}
    </article>
  );
}

function TerritoryTribute() {
  return (
    <section className="mx-auto max-w-[1224px] px-5 pt-12 lg:px-0">
      <div className="overflow-hidden rounded-[36px] bg-white/78 px-5 py-10 shadow-[0_18px_60px_rgba(58,36,103,0.1)] md:px-8 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex rounded-full bg-[#d66eff]/15 px-4 py-2 text-sm font-semibold text-[#7044c9]">
              Homenaje a los territorios
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] text-[#211734] md:text-[40px]">
              Los paisajes que también cuentan nuestra historia
            </h2>
            <p className="mt-5 text-lg leading-[1.55] text-[#6d6383] md:text-2xl">
              Montes, caminos, pueblos y miradores que acompañan el origen de
              las emprendedoras de la red.
            </p>
          </div>

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:relative lg:mx-0 lg:block lg:h-[390px] lg:overflow-visible lg:px-0 lg:pb-0">
            {territoryPhotos.map((photo, index) => (
              <figure
                key={photo.src}
                className={[
                  "group relative h-[142px] w-[188px] shrink-0 overflow-hidden rounded-[20px] bg-white shadow-[0_12px_30px_rgba(58,36,103,0.14)] transition duration-300 hover:z-20 hover:-translate-y-2 hover:rotate-0 lg:absolute",
                  territoryPhotoLayout[index] ?? "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211734]/15 via-transparent to-transparent opacity-60" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const itemIds = new Set(items.map((item) => item.id));
  const filteredColumns = galleryColumns.map((column) => column.filter((item) => itemIds.has(item.id)));

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
    };

    return galleryColumns.flat().filter((item) => {
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
        <TerritoryTribute />
        {visibleItems.length > 0 ? (
          <GalleryGrid items={visibleItems} />
        ) : (
          <div className="mx-auto mt-8 max-w-[1224px] rounded-[24px] bg-white px-6 py-20 text-center text-[#6d6383]">No encontramos contenido para esta búsqueda.</div>
        )}
        <div className="flex justify-center py-12">
          <button type="button" className="flex min-w-[140px] items-center justify-center gap-2 rounded-full border border-[#6d6383] px-6 py-3.5 text-lg font-bold text-[#6d6383] transition hover:bg-white/70">
            Ve más <ChevronDown size={24} />
          </button>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-tr-full border-[24px] border-b-0 border-l-0 border-[#ffcab9]/70" />
        <div className="pointer-events-none absolute bottom-0 right-0 flex items-end"><span className="h-20 w-20 rounded-full bg-[#dcbdd8]" /><span className="h-20 w-20 bg-[#dcbdd8] [clip-path:polygon(0_0,100%_100%,0_100%)]" /></div>
      </main>
      <PublicFooter />
    </div>
  );
}


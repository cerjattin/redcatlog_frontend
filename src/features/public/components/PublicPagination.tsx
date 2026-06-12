import { ChevronLeft, ChevronRight } from "lucide-react";

export function PublicPagination({ currentPage = 1, totalPages = 3 }: { currentPage?: number; totalPages?: number }) {
  return (
    <div className="flex items-center justify-center gap-7 py-16 md:py-20">
      <button
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6d6383]/20 text-white transition hover:bg-[#6d6383]/40 disabled:opacity-70"
      >
        <ChevronLeft />
      </button>
      <span className="text-sm font-medium text-[#6d6383]">Página {currentPage} de {totalPages}</span>
      <button
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6d6383]/20 text-white transition hover:bg-[#6d6383]/40 disabled:opacity-70"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

type PublicPaginationProps = {
  currentPage?: number;
  totalPages?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function PublicPagination({
  currentPage = 1,
  totalPages = 1,
  hasPreviousPage,
  hasNextPage,
  onPrevious,
  onNext,
}: PublicPaginationProps) {
  const canGoPrevious = hasPreviousPage ?? currentPage > 1;
  const canGoNext = hasNextPage ?? currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-7 py-16 md:py-20">
      <button
        type="button"
        disabled={!canGoPrevious}
        aria-label="Página anterior"
        onClick={onPrevious}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6d6383]/20 text-white transition hover:bg-[#6d6383]/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft />
      </button>

      <span className="text-sm font-medium text-[#6d6383]">
        Página {currentPage} de {Math.max(totalPages, 1)}
      </span>

      <button
        type="button"
        disabled={!canGoNext}
        aria-label="Página siguiente"
        onClick={onNext}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6d6383]/20 text-white transition hover:bg-[#6d6383]/40 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

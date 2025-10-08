import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  setCurrentPage: (page: number) => void;
  getPageNumbers: () => (number | string)[];
}

export function PaginationControls({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  setCurrentPage,
  getPageNumbers,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-center items-center gap-2 py-4">
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <ChevronLeft />
      </Button>

      {getPageNumbers().map((page, index) => {
        if (typeof page === 'number') {
          return (
            <Button
              key={page}
              size="icon"
              variant={currentPage === page ? "outline" : "ghost"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          );
        }
        return (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            {page}
          </span>
        );
      })}

      <Button
        size="icon"
        variant="ghost"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
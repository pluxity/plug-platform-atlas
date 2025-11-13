import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@plug-atlas/ui';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  maxVisible?: number;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  className,
  maxVisible = 5,
}: TablePaginationProps) => {
  if (totalPages < 1) return null;

  const getVisiblePages = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => { 
              e.preventDefault(); 
              onPrev();
            }}
          />
        </PaginationItem>

        {visiblePages.map((page) => (
          <PaginationItem key={page} className={currentPage === page ? 'bg-accent rounded-lg' : ''}>
            <PaginationLink
               onClick={(e) => { 
                e.preventDefault(); 
                onPageChange(page);
              }}
              className="shadow-none bg-transparent border-none"
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => { 
              e.preventDefault(); 
              onNext();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};


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
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrev,
  onNext,
  className = 'mt-5',
}: TablePaginationProps) => {
  if (totalPages < 1) return null;

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

        {Array.from({ length: totalPages }).map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={(e) => { 
                e.preventDefault(); 
                onPageChange(index + 1);
              }}
              isActive={currentPage === index + 1}
            >
              {index + 1}
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


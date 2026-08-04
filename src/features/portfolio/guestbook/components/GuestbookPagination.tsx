import Link from 'next/link';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface GuestbookPaginationProps {
  totalPages: number;
  currentPage: number;
}

const GuestbookPagination = ({ totalPages, currentPage }: GuestbookPaginationProps) => {
  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, 5);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <nav
      aria-label="방명록 페이지 탐색"
      className="flex items-center justify-center gap-1.5 sm:gap-2"
    >
      <Link
        href={`?page=${Math.max(1, currentPage - 5)}`}
        scroll={false}
        aria-label="5페이지 이전"
        className={cn(
          'focus-visible:ring-brand-primary text-brand-secondary hover:bg-brand-neutral-dark/5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === 1 && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronsLeft size={16} aria-hidden="true" />
      </Link>

      <Link
        href={`?page=${Math.max(1, currentPage - 1)}`}
        scroll={false}
        aria-label="이전 페이지"
        className={cn(
          'focus-visible:ring-brand-primary text-brand-secondary hover:bg-brand-neutral-dark/5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === 1 && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </Link>

      {pageNumbers.map((pageNum) => (
        <Link
          key={pageNum}
          href={`?page=${pageNum}`}
          scroll={false}
          aria-current={currentPage === pageNum ? 'page' : undefined}
          className={cn(
            'focus-visible:ring-brand-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors hover:font-bold focus-visible:ring-2 focus-visible:outline-none',
            currentPage === pageNum
              ? 'bg-brand-primary text-brand-neutral-light font-bold'
              : 'bg-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-dark/10',
          )}
        >
          {pageNum}
        </Link>
      ))}

      <Link
        href={`?page=${Math.min(totalPages, currentPage + 1)}`}
        scroll={false}
        aria-label="다음 페이지"
        className={cn(
          'focus-visible:ring-brand-primary text-brand-secondary hover:bg-brand-neutral-dark/5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === totalPages && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </Link>

      <Link
        href={`?page=${Math.min(totalPages, currentPage + 5)}`}
        scroll={false}
        aria-label="5페이지 다음"
        className={cn(
          'focus-visible:ring-brand-primary text-brand-secondary hover:bg-brand-neutral-dark/5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === totalPages && 'pointer-events-none opacity-30',
        )}
      >
        <ChevronsRight size={16} aria-hidden="true" />
      </Link>
    </nav>
  );
};

export default GuestbookPagination;

import Link from 'next/link';

import { cn } from '@/lib/utils';

interface GuestbookPaginationProps {
  totalPages: number;
  currentPage: number;
}

const GuestbookPagination = ({ totalPages, currentPage }: GuestbookPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="방명록 페이지 탐색" className="flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`?page=${pageNum}`}
          scroll={false}
          aria-current={currentPage === pageNum ? 'page' : undefined}
          className={cn(
            'focus-visible:ring-brand-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
            currentPage === pageNum
              ? 'bg-brand-primary text-brand-neutral-light font-bold'
              : 'bg-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-dark/10',
          )}
        >
          {pageNum}
        </Link>
      ))}
    </nav>
  );
};

export default GuestbookPagination;

import Link from 'next/link';

import { cn } from '@/lib/utils';

interface GuestbookPaginationProps {
  totalPages: number;
  currentPage: number;
}

const GuestbookPagination = ({ totalPages, currentPage }: GuestbookPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={`?page=${pageNum}`}
          scroll={false}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors',
            currentPage === pageNum
              ? 'bg-brand-primary text-brand-neutral-light font-bold'
              : 'bg-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-dark/10',
          )}
        >
          {pageNum}
        </Link>
      ))}
    </div>
  );
};

export default GuestbookPagination;

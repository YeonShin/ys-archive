'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface AdminGuestbookPaginationProps {
  totalPages: number;
  currentPage: number;
}

const AdminGuestbookPagination = ({ totalPages, currentPage }: AdminGuestbookPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  // 10개 단위 블록 계산 (예: 1~10, 11~20)
  const blockIndex = Math.floor((currentPage - 1) / 10);
  const startPage = blockIndex * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handleNavigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <nav
      aria-label="방명록 페이지 탐색"
      className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2"
    >
      <button
        type="button"
        onClick={() => handleNavigate(Math.max(1, currentPage - 5))}
        aria-label="5페이지 이전"
        disabled={currentPage <= 5}
        className={cn(
          'focus-visible:ring-admin-border text-admin-muted hover:bg-admin-border/50 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage <= 5 && 'opacity-30',
        )}
      >
        <ChevronsLeft size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => handleNavigate(Math.max(1, currentPage - 1))}
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        className={cn(
          'focus-visible:ring-admin-border text-admin-muted hover:bg-admin-border/50 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === 1 && 'opacity-30',
        )}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          type="button"
          onClick={() => handleNavigate(pageNum)}
          aria-label={`페이지 ${pageNum}`}
          aria-current={currentPage === pageNum ? 'page' : undefined}
          className={cn(
            'focus-visible:ring-admin-border flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors hover:font-bold focus-visible:ring-2 focus-visible:outline-none',
            currentPage === pageNum
              ? 'bg-admin-text text-admin-bg font-bold'
              : 'bg-admin-card text-admin-muted hover:bg-admin-border/50',
          )}
        >
          {pageNum}
        </button>
      ))}

      <button
        type="button"
        onClick={() => handleNavigate(Math.min(totalPages, currentPage + 1))}
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        className={cn(
          'focus-visible:ring-admin-border text-admin-muted hover:bg-admin-border/50 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage === totalPages && 'opacity-30',
        )}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => handleNavigate(Math.min(totalPages, currentPage + 5))}
        aria-label="5페이지 다음"
        disabled={currentPage >= totalPages - 4}
        className={cn(
          'focus-visible:ring-admin-border text-admin-muted hover:bg-admin-border/50 flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none',
          currentPage >= totalPages - 4 && 'opacity-30',
        )}
      >
        <ChevronsRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
};

export default AdminGuestbookPagination;

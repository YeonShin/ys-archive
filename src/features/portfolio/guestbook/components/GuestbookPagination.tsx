import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GuestbookPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface PageStepButton {
  label: string;
  icon: LucideIcon;
  targetPage: number;
  isDisabled: boolean;
}

const BUTTON_BASE_CLASS =
  'focus-visible:ring-brand-primary size-8 rounded-lg border-0 transition-colors focus-visible:ring-2 focus-visible:outline-none';
const STEP_BUTTON_CLASS =
  'text-brand-secondary hover:bg-brand-neutral-dark/5 hover:text-brand-secondary disabled:opacity-30';

const getPageNumbers = (totalPages: number, currentPage: number): number[] => {
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, 5);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

const GuestbookPagination = ({
  totalPages,
  currentPage,
  onPageChange,
}: GuestbookPaginationProps) => {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(totalPages, currentPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  const prevButtons: PageStepButton[] = [
    {
      label: '5페이지 이전',
      icon: ChevronsLeft,
      targetPage: Math.max(1, currentPage - 5),
      isDisabled: isFirstPage,
    },
    {
      label: '이전 페이지',
      icon: ChevronLeft,
      targetPage: Math.max(1, currentPage - 1),
      isDisabled: isFirstPage,
    },
  ];
  const nextButtons: PageStepButton[] = [
    {
      label: '다음 페이지',
      icon: ChevronRight,
      targetPage: Math.min(totalPages, currentPage + 1),
      isDisabled: isLastPage,
    },
    {
      label: '5페이지 다음',
      icon: ChevronsRight,
      targetPage: Math.min(totalPages, currentPage + 5),
      isDisabled: isLastPage,
    },
  ];

  const renderStepButton = ({ label, icon: Icon, targetPage, isDisabled }: PageStepButton) => (
    <Button
      key={label}
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      disabled={isDisabled}
      onClick={() => onPageChange(targetPage)}
      className={cn(BUTTON_BASE_CLASS, STEP_BUTTON_CLASS)}
    >
      <Icon size={16} aria-hidden="true" />
    </Button>
  );

  return (
    <nav
      aria-label="방명록 페이지 탐색"
      className="flex items-center justify-center gap-1.5 sm:gap-2"
    >
      {prevButtons.map(renderStepButton)}

      {pageNumbers.map((pageNum) => (
        <Button
          key={pageNum}
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-current={currentPage === pageNum ? 'page' : undefined}
          aria-label={`${pageNum} 페이지`}
          onClick={() => onPageChange(pageNum)}
          className={cn(
            BUTTON_BASE_CLASS,
            'text-sm font-normal hover:font-bold',
            currentPage === pageNum
              ? 'bg-brand-primary text-brand-neutral-light hover:bg-brand-primary hover:text-brand-neutral-light font-bold'
              : 'bg-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-dark/10 hover:text-brand-secondary',
          )}
        >
          {pageNum}
        </Button>
      ))}

      {nextButtons.map(renderStepButton)}
    </nav>
  );
};

export default GuestbookPagination;

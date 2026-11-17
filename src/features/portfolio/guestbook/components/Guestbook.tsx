'use client';

import { useOptimistic } from 'react';

import { motion } from 'motion/react';

import { getItemVariants } from '@/lib/animations';

import { GUESTBOOK_PAGE_SIZE } from '../constants/pagination';
import useGuestbookPage from '../hooks/useGuestbookPage';
import { GuestbookMessage, GuestbookResponse } from '../type';
import GuestbookForm from './GuestbookForm';
import GuestbookMessageList from './GuestbookMessageList';

interface GuestBookProps {
  initialGuestbook: GuestbookResponse;
}

export type OptimisticAction =
  | { type: 'add'; payload: GuestbookMessage }
  | { type: 'edit'; payload: Partial<GuestbookMessage> & { id: string } }
  | { type: 'delete'; payload: string };

const Guestbook = ({ initialGuestbook }: GuestBookProps) => {
  const { guestbook, totalCount, totalPages, currentPage, isLoading, hasError, goToPage, refresh } =
    useGuestbookPage(initialGuestbook);

  const [optimisticGuestbook, addOptimisticGuestbook] = useOptimistic<
    GuestbookMessage[],
    OptimisticAction
  >(guestbook, (state, action) => {
    switch (action.type) {
      case 'add':
        return [
          {
            ...action.payload,
            content: action.payload.isPublic ? action.payload.content : '비공개로 작성된 글입니다.',
          },
          ...state,
        ];
      case 'edit':
        return state.map((msg) =>
          msg.id === action.payload.id
            ? {
                ...msg,
                ...action.payload,
                content:
                  action.payload.isPublic === false
                    ? '비공개로 작성된 글입니다.'
                    : (action.payload.content ?? msg.content),
              }
            : msg,
        );
      case 'delete':
        return state.filter((msg) => msg.id !== action.payload);
      default:
        return state;
    }
  });

  const [optimisticTotalCount, addOptimisticTotalCount] = useOptimistic<number, OptimisticAction>(
    totalCount,
    (state, action) => {
      switch (action.type) {
        case 'add':
          return state + 1;
        case 'delete':
          return state - 1;
        default:
          return state;
      }
    },
  );

  const itemVariants = getItemVariants();

  const handleOptimisticUpdate = (action: OptimisticAction) => {
    addOptimisticGuestbook(action);
    addOptimisticTotalCount(action);
  };
  return (
    <motion.section
      variants={itemVariants}
      aria-label="방명록"
      className="bg-brand-neutral-muted mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-4 sm:p-7"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-brand-neutral-dark text-base font-bold">방명록</h3>
        <span className="text-brand-secondary font-mono text-xs">총 {optimisticTotalCount}개</span>
      </header>

      <GuestbookForm
        onOptimisticUpdate={handleOptimisticUpdate}
        currentPage={currentPage}
        onPageChange={goToPage}
      />

      <GuestbookMessageList
        guestbook={optimisticGuestbook.slice(0, GUESTBOOK_PAGE_SIZE)}
        totalPages={totalPages}
        currentPage={currentPage}
        isLoading={isLoading}
        hasError={hasError}
        onPageChange={goToPage}
        onRefresh={refresh}
        onOptimisticUpdate={handleOptimisticUpdate}
      />
    </motion.section>
  );
};

export default Guestbook;

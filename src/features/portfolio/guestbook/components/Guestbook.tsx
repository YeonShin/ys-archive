'use client';

import { useOptimistic } from 'react';

import { GuestbookMessage } from '../type';
import GuestbookForm from './GuestbookForm';
import GuestbookMessageList from './GuestbookMessageList';

interface GuestBookProps {
  guestbook: GuestbookMessage[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export type OptimisticAction =
  | { type: 'add'; payload: GuestbookMessage }
  | { type: 'edit'; payload: Partial<GuestbookMessage> & { id: string } }
  | { type: 'delete'; payload: string };

const Guestbook = ({ guestbook, totalCount, totalPages, currentPage }: GuestBookProps) => {
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

  const handleOptimisticUpdate = (action: OptimisticAction) => {
    addOptimisticGuestbook(action);
    addOptimisticTotalCount(action);
  };
  return (
    <section className="bg-brand-neutral-muted mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl p-7">
      <header className="flex items-center justify-between">
        <h3 className="text-brand-neutral-dark text-base font-bold">방명록</h3>
        <span className="text-brand-secondary font-mono text-xs">총 {optimisticTotalCount}개</span>
      </header>

      <GuestbookForm onOptimisticUpdate={handleOptimisticUpdate} />

      <GuestbookMessageList
        guestbook={optimisticGuestbook.slice(0, 5)}
        totalPages={totalPages}
        currentPage={currentPage}
        onOptimisticUpdate={handleOptimisticUpdate}
      />
    </section>
  );
};

export default Guestbook;

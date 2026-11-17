import { AnimatePresence } from 'motion/react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useGuestbookActions } from '../hooks/useGuestbookActions';
import { GuestbookMessage } from '../type';
import { getPageStatusMessage } from '../utils/guestbookPage';
import { OptimisticAction } from './Guestbook';
import GuestbookActionDialog from './GuestbookActionDialog';
import GuestbookMessageItem from './GuestbookMessageItem';
import GuestbookPagination from './GuestbookPagination';

interface GuestbookMessageListProps {
  guestbook: GuestbookMessage[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  hasError: boolean;
  onPageChange: (page: number) => void;
  onRefresh: () => Promise<void>;
  onOptimisticUpdate: (action: OptimisticAction) => void;
}

const GuestbookMessageList = ({
  guestbook,
  totalPages,
  currentPage,
  isLoading,
  hasError,
  onPageChange,
  onRefresh,
  onOptimisticUpdate,
}: GuestbookMessageListProps) => {
  const {
    actionState,
    setActionState,
    actionPassword,
    setActionPassword,
    editingId,
    setEditingId,
    unmaskedContent,
    isPending,
    handleInlineEditSubmit,
    handleActionSubmit,
  } = useGuestbookActions({ onOptimisticUpdate, onMutationSuccess: onRefresh });

  return (
    <>
      {hasError && (
        <div
          role="alert"
          className="text-brand-secondary flex items-center justify-center gap-3 text-sm"
        >
          <span>방명록을 불러오지 못했습니다.</span>
          <Button type="button" variant="outline" size="sm" onClick={() => void onRefresh()}>
            다시 시도
          </Button>
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {getPageStatusMessage(currentPage, isLoading, hasError)}
      </p>

      <ul
        aria-label="방명록 메시지 목록"
        aria-busy={isLoading}
        className={cn('flex w-full flex-col gap-3 transition-opacity', isLoading && 'opacity-50')}
      >
        <AnimatePresence initial={false}>
          {guestbook.map((message) => (
            <GuestbookMessageItem
              key={message.id}
              message={message}
              isEditing={editingId === message.id}
              unmaskedContent={editingId === message.id ? unmaskedContent : null}
              isPending={isPending}
              onEditClick={() => setActionState({ type: 'edit', message })}
              onDeleteClick={() => setActionState({ type: 'delete', message })}
              onEditCancel={() => setEditingId(null)}
              onEditSubmit={handleInlineEditSubmit}
            />
          ))}
        </AnimatePresence>
      </ul>

      <GuestbookPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      <GuestbookActionDialog
        isOpen={actionState.type !== null}
        actionType={actionState.type}
        actionPassword={actionPassword}
        setActionPassword={setActionPassword}
        isPending={isPending}
        onClose={() => setActionState({ type: null, message: null })}
        onSubmit={handleActionSubmit}
      />
    </>
  );
};

export default GuestbookMessageList;

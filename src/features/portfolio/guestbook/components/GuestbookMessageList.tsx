import { AnimatePresence } from 'motion/react';

import { useGuestbookActions } from '../hooks/useGuestbookActions';
import { GuestbookMessage } from '../type';
import { OptimisticAction } from './Guestbook';
import GuestbookActionDialog from './GuestbookActionDialog';
import GuestbookMessageItem from './GuestbookMessageItem';
import GuestbookPagination from './GuestbookPagination';

interface GuestbookMessageListProps {
  guestbook: GuestbookMessage[];
  totalPages: number;
  currentPage: number;
  onOptimisticUpdate: (action: OptimisticAction) => void;
}

const GuestbookMessageList = ({
  guestbook,
  totalPages,
  currentPage,
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
  } = useGuestbookActions({ onOptimisticUpdate });

  return (
    <>
      <ul className="flex w-full flex-col gap-3" aria-label="방명록 메시지 목록">
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

      <GuestbookPagination totalPages={totalPages} currentPage={currentPage} />

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

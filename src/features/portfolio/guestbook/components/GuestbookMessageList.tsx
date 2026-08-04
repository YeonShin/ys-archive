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
    isPending,
    handleInlineEditSubmit,
    handleActionSubmit,
  } = useGuestbookActions({ onOptimisticUpdate });

  return (
    <>
      <ul className="flex w-full flex-col gap-3">
        {guestbook.map((message) => (
          <GuestbookMessageItem
            key={message.id}
            message={message}
            isEditing={editingId === message.id}
            isPending={isPending}
            onEditClick={() => setActionState({ type: 'edit', message })}
            onDeleteClick={() => setActionState({ type: 'delete', message })}
            onEditCancel={() => setEditingId(null)}
            onEditSubmit={handleInlineEditSubmit}
          />
        ))}
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

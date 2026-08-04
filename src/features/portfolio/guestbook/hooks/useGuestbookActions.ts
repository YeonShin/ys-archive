import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { OptimisticAction } from '../components/Guestbook';
import {
  deleteGuestbookMessage,
  editGuestbookMessage,
  verifyPassword,
} from '../services/guestbookApi';
import { GuestbookMessage } from '../type';

interface UseGuestbookActionsProps {
  onOptimisticUpdate: (action: OptimisticAction) => void;
}

export const useGuestbookActions = ({ onOptimisticUpdate }: UseGuestbookActionsProps) => {
  const [actionState, setActionState] = useState<{
    type: 'edit' | 'delete' | null;
    message: GuestbookMessage | null;
  }>({ type: null, message: null });
  const [actionPassword, setActionPassword] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  const [unmaskedContent, setUnmaskedContent] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleInlineEditSubmit = (content: string, isPublic: boolean) => {
    if (!content.trim()) {
      toast.warning('수정할 내용을 입력해주세요.');
      return;
    }
    if (!editingId) return;

    startTransition(async () => {
      onOptimisticUpdate({
        type: 'edit',
        payload: {
          id: editingId,
          content: content.trim(),
          isPublic: isPublic,
        },
      });

      const result = await editGuestbookMessage({
        id: editingId,
        content: content.trim(),
        password: editPassword,
        isPublic: isPublic,
      });

      if (result.success) {
        toast.success('방명록이 수정되었습니다.');
        setEditingId(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleActionSubmit = async () => {
    const message = actionState.message;
    if (!message) return;
    if (!actionPassword.trim()) {
      toast.warning('비밀번호를 입력해주세요.');
      return;
    }

    if (actionState.type === 'edit') {
      startTransition(async () => {
        const result = await verifyPassword({
          id: message.id,
          password: actionPassword.trim(),
        });

        if (result.success) {
          // 비밀번호 확인 성공 시 인라인 수정 모드로 전환
          setEditingId(message.id);

          setUnmaskedContent(result.originalContent || message.content);
          setEditPassword(actionPassword.trim());

          setActionState({ type: null, message: null });
          setActionPassword('');
        } else {
          toast.error(result.message);
        }
      });
    } else if (actionState.type === 'delete') {
      startTransition(async () => {
        onOptimisticUpdate({
          type: 'delete',
          payload: message.id,
        });

        const result = await deleteGuestbookMessage({
          id: message.id,
          password: actionPassword,
        });

        if (result.success) {
          toast.success('삭제에 성공하였습니다.');

          setActionState({ type: null, message: null });
          setActionPassword('');
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  return {
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
  };
};

import React, { useState } from 'react';

import { Lock, LockOpen, Pen, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import {
  deleteGuestbookMessage,
  editGuestbookMessage,
  verifyPassword,
} from '../services/guestbookApi';
import { GuestbookMessage } from '../type';

interface GuestbookMessageListProps {
  guestbook: GuestbookMessage[];
}

const GuestbookMessageList = ({ guestbook }: GuestbookMessageListProps) => {
  const [actionState, setActionState] = useState<{
    type: 'edit' | 'delete' | null;
    message: GuestbookMessage | null;
  }>({ type: null, message: null });
  const [actionPassword, setactionPassword] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditPublic, setEditIsPublic] = useState(true);

  const handleInlineEditSubmit = async () => {
    if (!editContent.trim()) {
      toast.warning('수정할 내용을 입력해주세요.');
      return;
    }
    if (!editingId) return;

    const result = await editGuestbookMessage({
      id: editingId,
      content: editContent.trim(),
      password: editPassword,
      isPublic: isEditPublic,
    });

    if (result.success) {
      toast.success('방명록이 수정되었습니다.');
      setEditingId(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleActionSubmit = async () => {
    if (!actionState.message) return;
    if (!actionPassword.trim()) {
      toast.warning('비밀번호를 입력해주세요.');
      return;
    }

    if (actionState.type === 'edit') {
      const result = await verifyPassword({
        id: actionState.message.id,
        password: actionPassword.trim(),
      });

      if (result.success) {
        // 비밀번호 확인 성공 시 인라인 수정 모드로 전환
        setEditingId(actionState.message.id);
        setEditPassword(actionPassword.trim());
        setEditContent(actionState.message.content);
        setEditIsPublic(actionState.message.isPublic);

        setActionState({ type: null, message: null });
        setactionPassword('');
      } else {
        toast.error(result.message);
      }
    } else if (actionState.type === 'delete') {
      const result = await deleteGuestbookMessage({
        id: actionState.message.id,
        password: actionPassword,
      });

      if (result.success) {
        toast.success('삭제에 성공하였습니다.');

        setActionState({ type: null, message: null });
        setactionPassword('');
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <>
      <ul className="flex w-full flex-col gap-3">
        {guestbook.map((message) => (
          <li className="group bg-brand-neutral-light rounded-xl p-4" key={message.id}>
            <article>
              <header className="mb-2 flex items-center justify-between">
                <h4 className="text-brand-neutral-dark text-sm font-bold">{message.nickname}</h4>

                <div className="flex items-center justify-center gap-2">
                  {editingId !== message.id && (
                    <>
                      <button
                        onClick={() => setActionState({ type: 'edit', message })}
                        className="hover:bg-brand-neutral-muted text-brand-secondary flex cursor-default items-center justify-between gap-1 rounded-xl px-2 py-1 font-mono text-[10px] opacity-0 transition-all duration-100 group-hover:opacity-100 hover:scale-105"
                      >
                        <Pen size={10} /> 수정
                      </button>

                      <button
                        onClick={() => setActionState({ type: 'delete', message })}
                        className="text-brand-secondary flex cursor-default items-center justify-between gap-1 rounded-xl px-2 py-1 font-mono text-[10px] opacity-0 transition-all duration-100 group-hover:opacity-100 hover:scale-105 hover:bg-red-100"
                      >
                        <Trash size={10} /> 삭제
                      </button>
                    </>
                  )}
                  <time
                    className="text-brand-secondary/70 font-mono text-xs"
                    dateTime={message.createdAt}
                  >
                    {formatDate(message.createdAt, { includeDay: true })}
                  </time>
                </div>
              </header>

              {editingId === message.id ? (
                <div className="mt-2 flex flex-col gap-3">
                  <div className="bg-brand-neutral-muted focus-within:border-brand-primary relative w-full rounded-xl border-2 border-transparent transition-colors">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={200}
                      className="text-brand-neutral-dark placeholder:text-brand-secondary/70 w-full resize-none bg-transparent px-4 py-3 pb-12 text-left text-sm outline-none"
                    />
                    <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditIsPublic(!isEditPublic)}
                        className={cn(
                          'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors duration-200',
                          !isEditPublic
                            ? 'bg-brand-neutral-dark border-brand-neutral-dark text-brand-neutral-light'
                            : 'border-brand-secondary/40 text-brand-secondary bg-transparent',
                        )}
                      >
                        {isEditPublic ? (
                          <span className="flex items-center justify-center gap-2">
                            <LockOpen size={12} /> 공개
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Lock size={12} /> 비공개
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="absolute right-3 bottom-3 flex items-center gap-3">
                      <span className="text-brand-secondary/60 font-mono text-xs">
                        {editContent.length}/200
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(null)}
                      className="h-8 text-xs"
                    >
                      취소
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleInlineEditSubmit}
                      className="bg-brand-primary text-brand-neutral-light hover:bg-brand-primary/90 h-8 text-xs"
                    >
                      저장
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-brand-neutral-dark leading-relaxed">{message.content}</p>
              )}
            </article>
          </li>
        ))}
      </ul>

      <Dialog
        open={actionState.type !== null}
        onOpenChange={(open) => !open && setActionState({ type: null, message: null })}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Lock size={16} className="text-brand-primary" /> 비밀번호 확인
            </DialogTitle>
            <DialogDescription className="text-brand-secondary">
              {actionState.type === 'edit' ? '수정' : '삭제'}하려면 등록 시 입력한 비밀번호를
              입력해주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex">
            <input
              value={actionPassword}
              onChange={(data) => setactionPassword(data.target.value)}
              type="password"
              placeholder="비밀번호 입력"
              className="bg-brand-neutral-muted text-brand-neutral-dark placeholder:text-brand-secondary/70 focus:border-brand-primary flex-1 rounded-xl border-2 border-transparent px-4 py-2.5 text-sm transition-colors outline-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionState({ type: null, message: null })}
              className="border-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-muted"
            >
              취소
            </Button>
            <Button
              variant="default"
              onClick={handleActionSubmit}
              className={
                actionState.type === 'delete'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-brand-primary text-brand-neutral-light hover:bg-brand-primary/90'
              }
            >
              {actionState.type === 'edit' ? '수정' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuestbookMessageList;

import { useState } from 'react';

import { Lock, LockOpen, Pen, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import { GuestbookMessage } from '../type';

interface GuestbookMessageItemProps {
  message: GuestbookMessage;
  isEditing: boolean;
  unmaskedContent: string | null;
  isPending: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onEditCancel: () => void;
  onEditSubmit: (content: string, isPublic: boolean) => void;
}

const GuestbookMessageItem = ({
  message,
  isEditing,
  unmaskedContent,
  isPending,
  onEditClick,
  onDeleteClick,
  onEditCancel,
  onEditSubmit,
}: GuestbookMessageItemProps) => {
  const [content, setContent] = useState(message.content);
  const [isPublic, setIsPublic] = useState(message.isPublic);
  const [prevIsEditing, setPrevIsEditing] = useState(false);

  if (isEditing !== prevIsEditing) {
    setPrevIsEditing(isEditing);
    if (isEditing) {
      setContent(unmaskedContent ?? message.content);
      setIsPublic(message.isPublic);
    }
  }

  return (
    <li className="group bg-brand-neutral-light rounded-xl p-4">
      <article>
        <header className="mb-2 flex items-center justify-between">
          <h4 className="text-brand-neutral-dark text-sm font-bold">{message.nickname}</h4>

          <div className="flex items-center justify-center gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={onEditClick}
                  className="hover:bg-brand-neutral-muted text-brand-secondary flex cursor-default items-center justify-between gap-1 rounded-xl px-2 py-1 font-mono text-[10px] opacity-0 transition-all duration-100 group-hover:opacity-100 hover:scale-105"
                >
                  <Pen size={10} /> 수정
                </button>

                <button
                  onClick={onDeleteClick}
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

        {isEditing ? (
          <div className="mt-2 flex flex-col gap-3">
            <div className="bg-brand-neutral-muted focus-within:border-brand-primary relative w-full rounded-xl border-2 border-transparent transition-colors">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={200}
                className="text-brand-neutral-dark placeholder:text-brand-secondary/70 w-full resize-none bg-transparent px-4 py-3 pb-12 text-left text-sm outline-none"
              />
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors duration-200',
                    !isPublic
                      ? 'bg-brand-neutral-dark border-brand-neutral-dark text-brand-neutral-light'
                      : 'border-brand-secondary/40 text-brand-secondary bg-transparent',
                  )}
                >
                  {isPublic ? (
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
                  {content.length}/200
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onEditCancel} className="h-8 text-xs">
                취소
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onEditSubmit(content, isPublic)}
                disabled={isPending}
                className="bg-brand-primary text-brand-neutral-light hover:bg-brand-primary/90 h-8 text-xs disabled:opacity-50"
              >
                {isPending ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-brand-neutral-dark leading-relaxed">{message.content}</p>
        )}
      </article>
    </li>
  );
};

export default GuestbookMessageItem;

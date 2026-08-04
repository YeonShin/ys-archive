import { Lock, Pen, Trash } from 'lucide-react';
import { motion } from 'motion/react';

import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import { GuestbookMessage } from '../type';
import GuestbookEditForm from './GuestbookEditForm';

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
  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0, scale: 0.9 }}
      animate={{ opacity: 1, height: 'auto', scale: 1 }}
      exit={{ opacity: 0, height: 0, scale: 0.9, transition: { duration: 0.4 } }}
      transition={{ duration: 0.3, type: 'spring', bounce: 0.3 }}
      className="overflow-hidden"
    >
      <div className="group bg-brand-neutral-light rounded-xl p-4">
        <article>
          <header className="mb-2 flex items-center justify-between">
            <h4 className="text-brand-neutral-dark text-sm font-bold">{message.nickname}</h4>

            <div className="flex items-center justify-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={onEditClick}
                    aria-label="방명록 수정"
                    className="hover:bg-brand-neutral-muted text-brand-secondary flex cursor-default items-center justify-between gap-1 rounded-xl px-2 py-1 font-mono text-[10px] opacity-100 transition-all duration-100 hover:scale-105 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Pen size={10} aria-hidden="true" /> 수정
                  </button>

                  <button
                    onClick={onDeleteClick}
                    aria-label="방명록 삭제"
                    className="text-brand-secondary flex cursor-default items-center justify-between gap-1 rounded-xl px-2 py-1 font-mono text-[10px] opacity-100 transition-all duration-100 hover:scale-105 hover:bg-red-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash size={10} aria-hidden="true" /> 삭제
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
            <GuestbookEditForm
              message={message}
              unmaskedContent={unmaskedContent}
              isPending={isPending}
              onEditCancel={onEditCancel}
              onEditSubmit={onEditSubmit}
            />
          ) : (
            <p
              className={cn(
                'text-brand-neutral-dark text-sm leading-relaxed',
                message.isPublic === false && 'text-brand-secondary flex items-center gap-2 italic',
              )}
            >
              {message.isPublic === false ? (
                <>
                  <Lock size={14} aria-hidden="true" />
                  <span className="sr-only">비공개 메시지</span>
                  <span>{message.content}</span>
                </>
              ) : (
                <span>{message.content}</span>
              )}
            </p>
          )}
        </article>
      </div>
    </motion.li>
  );
};

export default GuestbookMessageItem;

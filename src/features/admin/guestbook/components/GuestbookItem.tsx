'use client';

import { Lock, Trash2, Unlock } from 'lucide-react';

import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import { AdminGuestbookItem } from '../types';

interface GuestbookItemProps {
  item: AdminGuestbookItem;
  onDelete: (id: string) => void;
}

const GuestbookItem = ({ item, onDelete }: GuestbookItemProps) => {
  return (
    <article className="group bg-admin-card border-admin-border hover:bg-admin-border/50 flex flex-col gap-3 rounded-xl border p-4 transition-colors">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-admin-text text-sm font-bold">{item.nickname}</h4>
          {item.isPublic ? (
            <span className="flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
              <Unlock className="mr-1 h-3 w-3" />
              공개
            </span>
          ) : (
            <span className="flex items-center rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-400">
              <Lock className="mr-1 h-3 w-3" />
              비공개
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDelete(item.id)}
            aria-label="강제 삭제"
            className="flex cursor-pointer items-center justify-center gap-1 rounded-lg px-2 py-1 font-mono text-[10px] text-red-400 opacity-100 transition-all duration-200 hover:scale-105 hover:bg-red-500/20 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Trash2 size={12} aria-hidden="true" /> 삭제
          </button>

          <time className="text-admin-muted font-mono text-xs" dateTime={item.createdAt}>
            {formatDate(item.createdAt, { includeDay: true })}
          </time>
        </div>
      </header>

      <p
        className={cn(
          'text-admin-text text-sm leading-relaxed whitespace-pre-wrap',
          !item.isPublic && 'text-admin-muted flex items-start gap-2 italic',
        )}
      >
        {!item.isPublic && <Lock size={14} className="mt-1 shrink-0" aria-hidden="true" />}
        <span>{item.content}</span>
      </p>
    </article>
  );
};

export default GuestbookItem;

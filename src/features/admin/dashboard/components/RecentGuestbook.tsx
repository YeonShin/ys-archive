import { Lock } from 'lucide-react';

import { GuestbookMessage } from '@/features/portfolio/guestbook/type';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

interface RecentGuestbookProps {
  guestbooks: GuestbookMessage[];
}

const RecentGuestbook = ({ guestbooks }: RecentGuestbookProps) => {
  return (
    <div className="bg-admin-card border-admin-border flex h-full flex-col rounded-xl border p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-admin-text text-lg font-semibold tracking-tight">최근 방명록</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {guestbooks.length === 0 ? (
          <div className="text-admin-muted flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            최근 작성된 방명록이 없습니다.
          </div>
        ) : (
          guestbooks.map((msg) => (
            <div
              key={msg.id}
              className="bg-admin-bg/50 border-admin-border flex flex-col rounded-xl border p-4"
            >
              <header className="mb-2 flex items-center justify-between">
                <h4 className="text-admin-text text-sm font-bold">{msg.nickname}</h4>
                <time className="text-admin-muted font-mono text-xs" dateTime={msg.createdAt}>
                  {formatDate(msg.createdAt, { includeDay: true })}
                </time>
              </header>

              <p
                className={cn(
                  'text-admin-text text-sm leading-relaxed',
                  msg.isPublic === false && 'text-admin-muted flex items-center gap-2 italic',
                )}
              >
                {msg.isPublic === false ? (
                  <>
                    <Lock size={14} aria-hidden="true" />
                    <span className="sr-only">비공개 메시지</span>
                    <span>{msg.content}</span>
                  </>
                ) : (
                  <span>{msg.content}</span>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentGuestbook;

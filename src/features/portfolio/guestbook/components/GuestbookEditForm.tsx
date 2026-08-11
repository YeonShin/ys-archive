import { useState } from 'react';

import { Lock, LockOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { GuestbookMessage } from '../type';

interface GuestbookEditFormProps {
  message: GuestbookMessage;
  unmaskedContent: string | null;
  isPending: boolean;
  onEditCancel: () => void;
  onEditSubmit: (content: string, isPublic: boolean) => void;
}

const GuestbookEditForm = ({
  message,
  unmaskedContent,
  isPending,
  onEditCancel,
  onEditSubmit,
}: GuestbookEditFormProps) => {
  const [content, setContent] = useState(unmaskedContent ?? message.content);
  const [isPublic, setIsPublic] = useState(message.isPublic);

  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="bg-brand-neutral-muted focus-within:ring-brand-primary relative w-full rounded-xl border-2 border-transparent transition-all focus-within:ring-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
          aria-label="방명록 수정 내용"
          className="text-brand-neutral-dark placeholder:text-brand-secondary/70 w-full resize-none bg-transparent px-4 py-3 pb-12 text-left text-sm outline-none"
        />
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label={isPublic ? '공개 모드' : '비공개 모드'}
            onClick={() => setIsPublic(!isPublic)}
            className={cn(
              'focus-visible:ring-brand-primary flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
              !isPublic
                ? 'bg-brand-neutral-dark border-brand-neutral-dark text-brand-neutral-light'
                : 'border-brand-secondary/40 text-brand-secondary bg-transparent',
            )}
          >
            {isPublic ? (
              <span className="flex items-center justify-center gap-2">
                <LockOpen size={12} aria-hidden="true" /> 공개
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock size={12} aria-hidden="true" /> 비공개
              </span>
            )}
          </button>
        </div>
        <div className="absolute right-3 bottom-3 flex items-center gap-3">
          <span className="text-brand-secondary/60 font-mono text-xs">{content.length}/200</span>
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
  );
};

export default GuestbookEditForm;

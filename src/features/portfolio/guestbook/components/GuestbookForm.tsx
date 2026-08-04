import { useState, useTransition } from 'react';

import { Lock, LockOpen } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { createGuestbookMessage } from '../services/guestbookApi';
import { OptimisticAction } from './Guestbook';

interface GuestbookFormProps {
  onOptimisticUpdate: (action: OptimisticAction) => void;
}

const GuestbookForm = ({ onOptimisticUpdate }: GuestbookFormProps) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nickname.trim() || !password.trim() || !content.trim()) {
      toast.warning('닉네임, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }

    const payload = {
      id: crypto.randomUUID(),
      nickname: nickname.trim(),
      password: password.trim(),
      content: content.trim(),
      isPublic: isPublic,
    };

    startTransition(async () => {
      onOptimisticUpdate({
        type: 'add',
        payload: {
          id: payload.id,
          nickname: payload.nickname,
          content: payload.content,
          isPublic: payload.isPublic,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      const result = await createGuestbookMessage(payload);

      if (result.success) {
        toast.success('방명록이 등록되었습니다.');
        setContent('');
        setIsPublic(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-neutral-light gap-4 space-y-3 rounded-2xl p-5"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            value={nickname}
            onChange={(data) => setNickname(data.target.value)}
            maxLength={20}
            className="bg-brand-neutral-muted text-brand-neutral-dark placeholder:text-brand-secondary/70 focus-visible:ring-brand-primary flex-1 rounded-xl border-2 border-transparent px-4 py-2.5 text-sm transition-all focus-visible:ring-2 focus-visible:outline-none"
            type="text"
            placeholder="닉네임"
            aria-label="닉네임"
          />
          <input
            value={password}
            onChange={(data) => setPassword(data.target.value)}
            className="bg-brand-neutral-muted text-brand-neutral-dark placeholder:text-brand-secondary/70 focus-visible:ring-brand-primary flex-1 rounded-xl border-2 border-transparent px-4 py-2.5 text-sm transition-all focus-visible:ring-2 focus-visible:outline-none"
            type="password"
            placeholder="비밀번호"
            aria-label="비밀번호"
            maxLength={20}
          />
        </div>

        <div className="bg-brand-neutral-muted focus-within:ring-brand-primary relative w-full rounded-xl border-2 border-transparent transition-all focus-within:ring-2">
          <textarea
            value={content}
            className="text-brand-neutral-dark placeholder:text-brand-secondary/70 w-full resize-none bg-transparent px-4 py-3 pb-12 text-left text-sm outline-none"
            name="content"
            onChange={(data) => setContent(data.target.value)}
            maxLength={200}
            placeholder="방명록을 남겨주세요 😊"
            aria-label="방명록 내용"
          />
          {/* Left Controls (비공개 토글 등) */}
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
                  <LockOpen size={12} /> 공개
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock size={12} /> 비공개
                </span>
              )}
            </button>
          </div>
          {/* Right Controls (글자수 & 등록 버튼) */}
          <div className="absolute right-3 bottom-3 flex items-center gap-3">
            <span className="text-brand-secondary/60 font-mono text-xs">{content.length}/200</span>
            <Button
              type="submit"
              variant="default"
              disabled={isPending}
              className="bg-brand-primary text-brand-neutral-light h-auto rounded-lg px-4 py-1.5 text-xs font-semibold transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? '등록 중...' : '등록'}
            </Button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <p className="text-center text-xs text-green-500">방명록이 등록되었습니다 ✓</p>
      )}
    </form>
  );
};

export default GuestbookForm;

import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface GuestbookActionDialogProps {
  isOpen: boolean;
  actionType: 'edit' | 'delete' | null;
  actionPassword: string;
  setActionPassword: (password: string) => void;
  isPending: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const GuestbookActionDialog = ({
  isOpen,
  actionType,
  actionPassword,
  setActionPassword,
  isPending,
  onClose,
  onSubmit,
}: GuestbookActionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Lock size={16} className="text-brand-primary" /> 비밀번호 확인
          </DialogTitle>
          <DialogDescription className="text-brand-secondary">
            {actionType === 'edit' ? '수정' : '삭제'}하려면 등록 시 입력한 비밀번호를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex">
          <input
            value={actionPassword}
            onChange={(e) => setActionPassword(e.target.value)}
            type="password"
            placeholder="비밀번호 입력"
            className="bg-brand-neutral-muted text-brand-neutral-dark placeholder:text-brand-secondary/70 focus:border-brand-primary flex-1 rounded-xl border-2 border-transparent px-4 py-2.5 text-sm transition-colors outline-none"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-brand-neutral-muted text-brand-secondary hover:bg-brand-neutral-muted"
          >
            취소
          </Button>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={isPending}
            className={cn(
              actionType === 'delete'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-brand-primary text-brand-neutral-light hover:bg-brand-primary/90',
              'disabled:opacity-50',
            )}
          >
            {isPending
              ? actionType === 'edit'
                ? '확인 중...'
                : '삭제 중...'
              : actionType === 'edit'
                ? '수정'
                : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestbookActionDialog;

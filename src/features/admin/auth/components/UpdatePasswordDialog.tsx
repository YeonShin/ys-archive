'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { updatePasswordAction } from '../actions/auth.action';
import { UpdatePasswordFormData, updatePasswordSchema } from '../type';

interface UpdatePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePasswordDialog = ({ isOpen, onClose }: UpdatePasswordDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const onSubmit = (data: UpdatePasswordFormData) => {
    startTransition(async () => {
      const result = await updatePasswordAction(data.password);

      if (!result.success) {
        toast.error(result.error || '비밀번호 변경에 실패했습니다.');
        return;
      }

      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      reset();
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-admin-card border-admin-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-admin-text text-xl">비밀번호 변경</DialogTitle>
          <DialogDescription className="text-admin-muted">
            새로운 비밀번호를 입력해주세요. 최소 6자 이상이어야 합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4" noValidate>
          <div className="space-y-2">
            <Label
              htmlFor="new-password"
              className="text-admin-text/90 block px-1 text-sm font-medium"
            >
              새 비밀번호
            </Label>
            <div className="relative">
              <Lock className="text-admin-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                className="border-admin-border bg-admin-bg text-admin-text placeholder:text-admin-muted/50 focus:ring-admin-text/20 focus:border-admin-text h-12 w-full rounded-xl border pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-destructive pl-1 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-admin-text text-admin-bg hover:bg-admin-text/90 shadow-admin-text/10 h-12 w-full rounded-xl text-base font-semibold shadow-lg"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
            변경하기
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordDialog;

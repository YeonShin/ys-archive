'use client';

import { useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
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

import { resetPasswordAction } from '../actions/auth.action';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../type';

interface ForgotPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog = ({ isOpen, onClose }: ForgotPasswordDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  const onSubmit = (data: ForgotPasswordFormData) => {
    startTransition(async () => {
      const result = await resetPasswordAction(data.email);

      if (!result.success) {
        toast.error(result.error || '이메일 발송에 실패했습니다.');
        return;
      }

      toast.success('비밀번호 재설정 이메일이 발송되었습니다.');
      reset();
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-admin-card border-admin-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-admin-text text-xl">비밀번호 찾기</DialogTitle>
          <DialogDescription className="text-admin-muted">
            가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-admin-text/90 block px-1 text-sm font-medium">
              이메일
            </Label>
            <div className="relative">
              <Mail className="text-admin-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                className="border-admin-border bg-admin-bg text-admin-text placeholder:text-admin-muted/50 focus:ring-admin-text/20 focus:border-admin-text h-12 w-full rounded-xl border pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-destructive pl-1 text-sm">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-admin-text text-admin-bg hover:bg-admin-text/90 shadow-admin-text/10 h-12 w-full rounded-xl text-base font-semibold shadow-lg"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
            이메일 발송
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;

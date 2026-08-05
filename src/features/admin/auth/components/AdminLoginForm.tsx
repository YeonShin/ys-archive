'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { loginAdminAction } from '../actions/auth.action';
import { LoginFormData, loginSchema } from '../type';
import ForgotPasswordDialog from './ForgotPasswordDialog';

const AdminLoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isFindPasswordOpen, setIsFindPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    startTransition(async () => {
      const formData = { email: data.email, password: data.password };

      const result = await loginAdminAction(formData);

      if (!result.success) {
        toast.error(result.error || '로그인에 실패했습니다.');
        return;
      }

      toast.success('로그인 성공');
      router.push('/admin');
      router.refresh();
    });
  };

  return (
    <div className="bg-admin-card border-admin-border w-full max-w-md rounded-2xl border p-8 shadow-xl">
      <div className="mb-8 text-start">
        <div className="bg-admin-text mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg shadow-[0_0_15px_rgba(250,250,250,0.1)]">
          <span className="text-admin-bg font-mono text-sm font-bold">YS</span>
        </div>
        <h1 className="text-admin-text text-2xl font-bold">관리자 로그인</h1>
        <p className="text-admin-muted mt-2 text-sm">포트폴리오 CMS에 오신 것을 환영합니다</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-admin-text/90 block px-1 text-sm font-medium">
            이메일 주소
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
          {errors.email && <p className="text-destructive pl-1 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-admin-text/90 block px-1 text-sm font-medium">
            비밀번호
          </Label>
          <div className="relative">
            <Lock className="text-admin-muted absolute top-1/2 left-4 size-5 -translate-y-1/2" />
            <Input
              id="password"
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
          className="bg-admin-text text-admin-bg hover:bg-admin-text/90 shadow-admin-text/10 mt-4 h-12 w-full rounded-xl text-base font-semibold shadow-lg"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
          로그인
        </Button>
      </form>
      <div className="flex items-center justify-center">
        <Button
          variant="link"
          onClick={() => setIsFindPasswordOpen(true)}
          className="text-admin-muted hover:text-admin-text mt-6 cursor-pointer text-xs underline transition-colors duration-300"
        >
          비밀번호를 잊었습니까?
        </Button>
      </div>

      <ForgotPasswordDialog
        isOpen={isFindPasswordOpen}
        onClose={() => setIsFindPasswordOpen(false)}
      />
    </div>
  );
};

export default AdminLoginForm;

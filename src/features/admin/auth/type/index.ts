import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const updatePasswordSchema = z.object({
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

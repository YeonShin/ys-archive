import { z } from 'zod';

export const techTypeEnum = z.enum([
  'FRONTEND',
  'BACKEND',
  'INFRA',
  'DATABASE',
  'MOBILE',
  'DEVOPS',
  'AI_ML',
  'TESTING',
]);

export const techLevelEnum = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

export const techStackFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, '기술 스택 이름을 입력해주세요.'),
  icon: z.string().min(1, '아이콘 이름(또는 식별자)을 입력해주세요.'),
  type: techTypeEnum,
  level: techLevelEnum.nullable().optional(),
  color: z.string().nullable().optional(),
});

export type TechStackFormData = z.infer<typeof techStackFormSchema>;

export interface TechStack {
  id: string;
  name: string;
  icon: string;
  type: z.infer<typeof techTypeEnum>;
  level: z.infer<typeof techLevelEnum> | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export type InsertTechStackDto = Omit<TechStack, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTechStackDto = Partial<InsertTechStackDto>;

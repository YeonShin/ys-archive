import z from 'zod';

export const experiencesFormSchema = z.object({
  title: z.string().min(1, '역할/학위 이름을 입력해주세요.'),
  organization: z.string().min(1, '소속 기관/학교를 입력해주세요.'),
  description: z.string().nullable().optional(),

  tech_stacks: z
    .array(z.object({ value: z.string().min(1, '기술스택을 입력해주세요.') }))
    .optional(),

  details: z.array(z.object({ value: z.string().min(1, '상세 내용을 입력해주세요.') })).optional(),

  started_at: z.string().min(1, '시작일을 입력해주세요.'),
  ended_at: z.string().nullable().optional(),
});

export type ExperienceFormData = z.infer<typeof experiencesFormSchema>;

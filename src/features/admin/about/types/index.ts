import { z } from 'zod';

export const portfolioContentSchema = z.object({
  developer_role: z.string().min(1, '개발자 직군을 입력해주세요.'),
  hero_title: z.string().min(1, '히어로 타이틀을 입력해주세요.'),
  hero_description: z.string().min(1, '히어로 설명을 입력해주세요.'),
  profile_image_url: z.string().nullable().optional(),
  about_text: z.string().min(1, 'About 본문을 입력해주세요.'),
  resume_url: z.string().nullable().optional(),
});

export const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, '연락처 이름을 입력해주세요.'),
  icon: z.string().min(1, '아이콘 이름을 입력해주세요.'),
  url: z.string().min(1, 'URL을 입력해주세요.'),
  description: z.string().nullable().optional(),
});

export const aboutFormSchema = z.object({
  portfolioContent: portfolioContentSchema,
  contacts: z.array(contactSchema),
});

export type PortfolioContentFormData = z.infer<typeof portfolioContentSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type AboutFormData = z.infer<typeof aboutFormSchema>;

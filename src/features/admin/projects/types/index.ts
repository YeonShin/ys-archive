import { z } from 'zod';

export const projectStatusEnum = z.enum(['IN_PROGRESS', 'LIVE', 'COMPLETED']);

export const linkSchema = z.object({
  service: z.string().url('유효한 서비스 URL을 입력해주세요.').optional().or(z.literal('')),
  github: z.string().url('유효한 깃허브 URL을 입력해주세요.').optional().or(z.literal('')),
});

export const techStackSchema = z.object({
  name: z.string().min(1, '기술스택 이름을 입력해주세요.'),
  reason: z.string().min(1, '선정 이유를 입력해주세요.'),
});

export const architectureSchema = z.object({
  name: z.string().min(1, '아키텍처 이름을 입력해주세요.'),
  caption: z.string().optional(),
  url: z.string().url('유효한 이미지 URL을 입력해주세요.'),
});

export const keyFeatureSchema = z.object({
  title: z.string().min(1, '기능 제목을 입력해주세요.'),
  desc: z
    .array(z.object({ value: z.string().min(1, '설명을 입력해주세요.') }))
    .min(1, '최소 1개의 설명이 필요합니다.'),
});

export const troubleshootingImageSchema = z.object({
  url: z.string().url('유효한 이미지 URL을 입력해주세요.'),
  caption: z.string().optional(),
});

export const troubleshootingSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  problem: z.string().min(1, '문제 상황을 입력해주세요.'),
  cause: z.string().min(1, '원인을 입력해주세요.'),
  process: z.string().min(1, '해결 과정을 입력해주세요.'),
  result: z.string().min(1, '결과를 입력해주세요.'),
  images: z.array(troubleshootingImageSchema),
});

export const projectFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, '프로젝트명을 입력해주세요.'),
  subtitle: z.string().nullable().optional(),
  status: projectStatusEnum,
  started_at: z.string().min(1, '시작 날짜를 입력해주세요.'),
  ended_at: z.string().nullable().optional(),
  role: z.string().min(1, '담당 역할을 입력해주세요.'),
  links: linkSchema.nullable().optional(),
  thumbnail_url: z.string().url('유효한 썸네일 URL을 입력해주세요.'),
  tech_stacks: z.array(techStackSchema),
  images: z.array(z.object({ value: z.string().url('유효한 URL을 입력해주세요.') })),

  description: z.string().min(1, '프로젝트 설명을 입력해주세요.'),
  architecture: z.array(architectureSchema),
  key_features: z.array(keyFeatureSchema),
  troubleshooting: z.array(troubleshootingSchema),
  retrospective: z.string().nullable().optional(),
  priority: z.number().int(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

// DB 조회 결과를 매핑하기 위한 순수 타입 선언
export interface Project {
  id: string;
  title: string;
  subtitle: string | null;
  status: z.infer<typeof projectStatusEnum>;
  started_at: string;
  ended_at: string | null;
  role: string;
  links: z.infer<typeof linkSchema> | null;
  thumbnail_url: string;
  tech_stacks: z.infer<typeof techStackSchema>[];
  images: string[];
  description: string;
  architecture: z.infer<typeof architectureSchema>[];
  key_features: { title: string; desc: string[] }[];
  troubleshooting: z.infer<typeof troubleshootingSchema>[];
  retrospective: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export type InsertProjectDto = Omit<Project, 'created_at' | 'updated_at'>;
export type UpdateProjectDto = Partial<InsertProjectDto>;

export type ProjectListItem = Pick<
  Project,
  | 'id'
  | 'title'
  | 'subtitle'
  | 'status'
  | 'started_at'
  | 'ended_at'
  | 'role'
  | 'links'
  | 'tech_stacks'
  | 'thumbnail_url'
  | 'priority'
>;

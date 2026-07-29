export const TECH_TYPE = {
  FRONTEND: { value: 'FRONTEND', label: '프론트엔드' },
  BACKEND: { value: 'BACKEND', label: '백엔드' },
  INFRA: { value: 'INFRA', label: '인프라' },
  DATABASE: { value: 'DATABASE', label: '데이터베이스' },
  MOBILE: { value: 'MOBILE', label: '모바일' },
  DEVOPS: { value: 'DEVOPS', label: '데브옵스' },
  AI_ML: { value: 'AI_ML', label: 'AI/머신러닝' },
  TESTING: { value: 'TESTING', label: '테스트' },
} as const;

export type TechType = (typeof TECH_TYPE)[keyof typeof TECH_TYPE];

export const TECH_LEVEL: Record<string, string> = {
  EXPERT: '주력 스택',
  ADVANCED: '실무 적용',
  INTERMEDIATE: '프로젝트 경험',
  BEGINNER: '학습 중',
  BASIC: '기초 지식',
};

export interface TechItem {
  id: string;
  name: string;
  icon: string;
  color: string | null;
  type: TechType;
  level: string | null;
}

export interface TechStacksSectionData {
  techStack: TechItem[];
}

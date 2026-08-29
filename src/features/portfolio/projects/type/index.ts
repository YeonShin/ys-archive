export const PROJECT_STATUS = {
  IN_PROGRESS: { value: 'IN_PROGRESS', label: '진행 중' },
  LIVE: { value: 'LIVE', label: '서비스 중' },
  COMPLETED: { value: 'COMPLETED', label: '완료' },
} as const;

export type StatusType = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export function isProjectStatus(status: unknown): status is keyof typeof PROJECT_STATUS {
  return typeof status === 'string' && status in PROJECT_STATUS;
}
export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectTechStack {
  name: string;
  reason: string;
}

export interface ProjectArchitecture {
  name: string;
  caption: string;
  url: string;
}

export interface ProjectKeyFeature {
  title: string;
  desc: string[];
}

export interface ProjectTroubleshootingImage {
  url: string;
  caption: string;
}

export interface ProjectTroubleshooting {
  title: string;
  problem: string;
  cause: string;
  process: string;
  result: string;
  images?: ProjectTroubleshootingImage[];
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  status: StatusType;
  startedAt: string;
  endedAt?: string;
  role: string;
  links?: ProjectLink[];
  thumbnailUrl: string;
  techStacks?: ProjectTechStack[];
  images?: string[];
  description: string;
  architecture?: ProjectArchitecture[];
  keyFeatures?: ProjectKeyFeature[];
  troubleshooting?: ProjectTroubleshooting[];
  retrospective?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsSectionData {
  projects: Project[];
}

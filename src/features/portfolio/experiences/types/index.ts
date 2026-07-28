export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  description?: string;
  techStacks?: string[];
  details?: string[];
  startedAt: string;
  endedAt?: string | null;
}

export interface ExperiencesSectionData {
  experiences: ExperienceItem[];
}

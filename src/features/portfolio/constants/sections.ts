export const PORTFOLIO_SECTIONS = [
  'hero',
  'about',
  'experience',
  'tech',
  'projects',
  'contact',
] as const;

export type SectionId = (typeof PORTFOLIO_SECTIONS)[number];

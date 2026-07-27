import { Database } from '@/types/database.types';

export type PortfolioContentDTO = Database['public']['Tables']['portfolio_content']['Row'];

export interface HeroSectionData {
  heroTitle: string;
  heroDescription: string;
}

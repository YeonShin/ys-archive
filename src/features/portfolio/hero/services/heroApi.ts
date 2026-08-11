import { createClient } from '@/lib/supabase/server';

import type { HeroSectionData } from '../types';

export const fetchHeroData = async (): Promise<HeroSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('hero_title, hero_description')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.error('[heroApi.fetchHeroData] Failed to fetch hero data:', error);
      return null;
    }

    return {
      heroTitle: data.hero_title ?? '',
      heroDescription: data.hero_description ?? '',
    };
  } catch (error) {
    console.error('[heroApi.fetchHeroData] Unexpected error during fetch:', error);
    return null;
  }
};

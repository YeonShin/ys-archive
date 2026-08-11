import { createClient } from '@/lib/supabase/server';

import type { AboutSectionData } from '../types';

export const fetchAboutData = async (): Promise<AboutSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('about_text, profile_image_url, resume_url')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.error('[aboutApi.fetchHeroData] Failed to fetch hero data:', error);
      return null;
    }

    return {
      aboutText: data.about_text ?? '',
      profileImageUrl: data.profile_image_url ?? undefined,
      resumeUrl: data.resume_url ?? undefined,
    };
  } catch (error) {
    console.error('[aboutApi.fetchAboutData] Unexpected error during fetch:', error);
    return null;
  }
};

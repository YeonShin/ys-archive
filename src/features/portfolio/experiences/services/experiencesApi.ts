import { createClient } from '@/lib/supabase/server';

import type { ExperienceItem, ExperiencesSectionData } from '../types';

export const fetchExperiencesData = async (): Promise<ExperiencesSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('started_at', { ascending: false });

    if (error || !data) {
      console.error(
        '[experiencesApi.fetchExperiencesData] Failed to fetch experiences data:',
        error,
      );
      return null;
    }

    const experiences: ExperienceItem[] = data.map((item) => ({
      id: item.id,
      title: item.title,
      organization: item.organization,
      description: item.description ?? undefined,
      techStacks: item.tech_stacks ?? undefined,
      details: item.details ?? undefined,
      startedAt: item.started_at,
      endedAt: item.ended_at ?? null,
    }));

    return { experiences };
  } catch (error) {
    console.error('[experiencesApi.fetchExperiencesData] Unexpected error during fetch:', error);
    return null;
  }
};

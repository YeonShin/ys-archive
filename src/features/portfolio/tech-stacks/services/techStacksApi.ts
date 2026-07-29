import { createClient } from '@/lib/supabase/server';

import { TECH_LEVEL, TECH_TYPE, TechItem, TechStacksSectionData } from '../types';

export const fetchTechStacksData = async (): Promise<TechStacksSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('tech_stacks')
      .select('*')
      .order('type', { ascending: true })
      .order('level', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('[techStacksApi.fetchTechStacksData] Error fetching tech stacks:', error);
      return null;
    }

    const techStack: TechItem[] = data.map((item) => {
      const mappedLevel = item.level
        ? TECH_LEVEL[String(item.level).toUpperCase()] || item.level
        : null;

      return {
        id: item.id,
        name: item.name,
        icon: item.icon,
        color: item.color,
        type: TECH_TYPE[item.type as keyof typeof TECH_TYPE] || {
          value: item.type,
          label: item.type,
        },
        level: mappedLevel,
      };
    });

    return { techStack };
  } catch (error) {
    console.error('[techStacksApi.fetchTechStacksData] Exception fetching tech stacks:', error);
    return null;
  }
};

import { createClient } from '@/lib/supabase/server';
import { isArrayOfObjects, isArrayOfStrings, isObject } from '@/lib/typeGuards';

import {
  PROJECT_STATUS,
  Project,
  ProjectArchitecture,
  ProjectKeyFeature,
  ProjectLinks,
  ProjectTechStack,
  ProjectTroubleshooting,
  ProjectsSectionData,
  isProjectStatus,
} from '../type';

export const fetchProjectsData = async (): Promise<ProjectsSectionData | null> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('priority', { ascending: false })
      .order('started_at', { ascending: false });

    if (error || !data) {
      console.error('[projectsApi.fetchProjectssData] Failed to fetch projects data:', error);
      return null;
    }

    const projects: Project[] = data.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? undefined,
      status: isProjectStatus(item.status)
        ? PROJECT_STATUS[item.status]
        : PROJECT_STATUS.IN_PROGRESS,
      startedAt: item.started_at,
      endedAt: item.ended_at ?? undefined,
      role: item.role,
      links: isObject<ProjectLinks>(item.links) ? item.links : undefined,
      thumbnailUrl: item.thumbnail_url,
      techStacks: isArrayOfObjects<ProjectTechStack>(item.tech_stacks)
        ? item.tech_stacks
        : undefined,
      images: isArrayOfStrings(item.images) ? item.images : undefined,
      description: item.description,
      architecture: isArrayOfObjects<ProjectArchitecture>(item.architecture)
        ? item.architecture
        : undefined,
      keyFeatures: isArrayOfObjects<ProjectKeyFeature>(item.key_features)
        ? item.key_features
        : undefined,
      troubleshooting: isArrayOfObjects<ProjectTroubleshooting>(item.troubleshooting)
        ? item.troubleshooting
        : undefined,
      retrospective: item.retrospective ?? undefined,
      priority: item.priority,
      createdAt: item.created_at,
      updatedAt: item.updated_at ?? item.created_at,
    }));

    return { projects };
  } catch (error) {
    console.error('[projectsApi.fetchProjectsData] Unexpected error during fetch:', error);
    return null;
  }
};

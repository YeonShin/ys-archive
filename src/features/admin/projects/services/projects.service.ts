import { createClient } from '@/lib/supabase/server';

import { InsertProjectDto, UpdateProjectDto } from '../types';

export const getProjectsList = async () => {
  try {
    const supabase = await createClient();

    const res = await supabase
      .from('projects')
      .select(
        'id, title, subtitle, status, started_at, ended_at, role, links, tech_stacks, thumbnail_url, priority',
      )
      .order('priority', { ascending: false });

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[Projects.getExperiencesData] 데이터 조회 중 에러 발생:', error);

    // Supabase 에러 객체일 경우 message를 가지고 있으므로 이를 추출
    let errorMessage = '알 수 없는 에러가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }

    return { success: false, message: errorMessage, data: null };
  }
};

export const getProjectById = async (id: string) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('projects').select('*').eq('id', id).single();

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[Projects.getProjectById] 데이터 조회 중 에러 발생:', error);

    let errorMessage = '알 수 없는 에러가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }

    return { success: false, message: errorMessage, data: null };
  }
};

export const createProject = async (projectData: InsertProjectDto) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('projects').insert(projectData).select('*').single();

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.createProject] 데이터 생성 중 에러 발생:', error);

    let errorMessage = '알 수 없는 에러가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }

    return { success: false, message: errorMessage };
  }
};

export const updateProject = async (id: string, projectData: UpdateProjectDto) => {
  try {
    const supabase = await createClient();
    const res = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select('*')
      .single();

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.updateProject] 데이터 수정 중 에러 발생:', error);

    let errorMessage = '알 수 없는 에러가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }

    return { success: false, message: errorMessage };
  }
};

export const deleteProject = async (id: string) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('projects').delete().eq('id', id);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Projects.deleteProject] 데이터 삭제 중 에러 발생:', error);

    let errorMessage = '알 수 없는 에러가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }

    return { success: false, message: errorMessage };
  }
};

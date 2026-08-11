import { createClient } from '@/lib/supabase/server';

import { ExperienceFormData } from '../types';

// 타입 정의를 맞추기 위해 임시로 에러 메시지를 포함하여 반환합니다.
export const getExperiencesData = async () => {
  try {
    const supabase = await createClient();

    const res = await supabase
      .from('experiences')
      .select('*')
      .order('started_at', { ascending: true });

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[Experiences.getExperiencesData] 데이터 조회 중 에러 발생:', error);

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

export const createExperience = async (data: ExperienceFormData) => {
  try {
    const supabase = await createClient();

    const payload = {
      title: data.title,
      organization: data.organization,
      started_at: data.started_at,
      ended_at: data.ended_at,
      description: data.description,
      tech_stacks: data.tech_stacks?.map((t) => t.value) || [],
      details: data.details?.map((d) => d.value) || [],
    };

    const res = await supabase.from('experiences').insert(payload);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Experiences.createExperience] 에러 발생:', error);
    let errorMessage = 'DB 생성 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

export const updateExperience = async (id: string, data: ExperienceFormData) => {
  try {
    const supabase = await createClient();

    const payload = {
      title: data.title,
      organization: data.organization,
      started_at: data.started_at,
      ended_at: data.ended_at,
      description: data.description,
      tech_stacks: data.tech_stacks?.map((t) => t.value) || [],
      details: data.details?.map((d) => d.value) || [],
    };

    const res = await supabase.from('experiences').update(payload).eq('id', id);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Experiences.updateExperience] 에러 발생:', error);
    let errorMessage = 'DB 수정 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

export const deleteExperience = async (id: string) => {
  try {
    const supabase = await createClient();

    const res = await supabase.from('experiences').delete().eq('id', id);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[Experiences.deleteExperience] 에러 발생:', error);
    let errorMessage = 'DB 삭제 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

import { createClient } from '@/lib/supabase/server';

import { InsertTechStackDto, UpdateTechStackDto } from '../types';

export const getTechStacks = async () => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('tech_stacks').select('*').order('type', { ascending: true });

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[TechStacks.getTechStacks] 에러 발생:', error);
    let errorMessage = 'DB 조회 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage, data: null };
  }
};

export const createTechStack = async (payload: InsertTechStackDto) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('tech_stacks').insert(payload).select().single();

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[TechStacks.createTechStack] 에러 발생:', error);
    let errorMessage = 'DB 생성 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

export const updateTechStack = async (id: string, payload: UpdateTechStackDto) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('tech_stacks').update(payload).eq('id', id).select().single();

    if (res.error) {
      throw res.error;
    }

    return { success: true, data: res.data };
  } catch (error: unknown) {
    console.error('[TechStacks.updateTechStack] 에러 발생:', error);
    let errorMessage = 'DB 수정 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

export const deleteTechStack = async (id: string) => {
  try {
    const supabase = await createClient();
    const res = await supabase.from('tech_stacks').delete().eq('id', id);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[TechStacks.deleteTechStack] 에러 발생:', error);
    let errorMessage = 'DB 삭제 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

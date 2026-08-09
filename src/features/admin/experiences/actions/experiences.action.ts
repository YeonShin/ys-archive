'use server';
import { revalidatePath } from 'next/cache';

import {
  createExperience,
  deleteExperience,
  updateExperience,
} from '../services/experiences.service';
import { experiencesFormSchema } from '../types';

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function createExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const rawData = formData.get('data');
    if (!rawData || typeof rawData !== 'string') {
      return { success: false, message: '데이터가 누락되었습니다.' };
    }

    const parsedData = JSON.parse(rawData);
    const validation = experiencesFormSchema.safeParse(parsedData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const res = await createExperience(validation.data);

    if (!res.success) {
      return { success: false, message: res.message };
    }

    revalidatePath('/admin/experience');
    return { success: true, message: res.message || '생성 완료' };
  } catch (error) {
    console.error('[Experiences.createExperienceAction] 에러 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

export async function updateExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const id = formData.get('id');
    const rawData = formData.get('data');

    if (!id || typeof id !== 'string' || !rawData || typeof rawData !== 'string') {
      return { success: false, message: '필수 데이터가 누락되었습니다.' };
    }

    const parsedData = JSON.parse(rawData);
    const validation = experiencesFormSchema.safeParse(parsedData);

    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const res = await updateExperience(id, validation.data);

    if (!res.success) {
      return { success: false, message: res.message };
    }

    revalidatePath('/admin/experience');
    return { success: true, message: res.message || '수정 완료' };
  } catch (error) {
    console.error('[Experiences.updateExperienceAction] 에러 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

export async function deleteExperienceAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const id = formData.get('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!id || typeof id !== 'string' || !uuidRegex.test(id)) {
      return { success: false, message: '유효하지 않은 ID입니다.' };
    }

    const res = await deleteExperience(id);

    if (!res.success) {
      return { success: false, message: res.message };
    }

    revalidatePath('/admin/experience');
    return { success: true, message: res.message || '삭제 완료' };
  } catch (error) {
    console.error('[Experiences.deleteExperienceAction] 에러 발생:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다.',
    };
  }
}

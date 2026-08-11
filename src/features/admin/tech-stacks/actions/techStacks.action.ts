'use server';

import { revalidatePath } from 'next/cache';

import { ActionResponse } from '@/types/response';

import { createTechStack, deleteTechStack, updateTechStack } from '../services/techStacks.service';
import { InsertTechStackDto, UpdateTechStackDto } from '../types';

export async function createTechStackAction(
  prevState: unknown,
  payload: InsertTechStackDto,
): Promise<ActionResponse> {
  const result = await createTechStack(payload);

  if (result.success) {
    revalidatePath('/admin/tech-stacks');
    revalidatePath('/'); // 포트폴리오 메인 페이지 캐시 무효화
    return { success: true };
  }

  return { success: false, message: result.message };
}

export async function updateTechStackAction(
  prevState: unknown,
  id: string,
  payload: UpdateTechStackDto,
): Promise<ActionResponse> {
  const result = await updateTechStack(id, payload);

  if (result.success) {
    revalidatePath('/admin/tech-stacks');
    revalidatePath('/');
    return { success: true };
  }

  return { success: false, message: result.message };
}

export async function deleteTechStackAction(
  prevState: unknown,
  id: string,
): Promise<ActionResponse> {
  const result = await deleteTechStack(id);

  if (result.success) {
    revalidatePath('/admin/tech-stacks');
    revalidatePath('/');
    return { success: true };
  }

  return { success: false, message: result.message };
}

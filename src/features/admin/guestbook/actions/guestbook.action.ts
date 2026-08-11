'use server';

import { revalidatePath } from 'next/cache';

import { ActionResponse } from '@/types/response';

import { deleteAdminGuestbook } from '../services/guestbook.service';

export async function deleteAdminGuestbookAction(
  prevState: unknown,
  id: string,
): Promise<ActionResponse> {
  const result = await deleteAdminGuestbook(id);

  if (result.success) {
    revalidatePath('/admin/guestbook');
    revalidatePath('/');
    return { success: true };
  }

  return { success: false, message: result.message };
}

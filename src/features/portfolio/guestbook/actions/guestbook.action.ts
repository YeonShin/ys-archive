'use server';

import { revalidatePath } from 'next/cache';

import { ActionResponse } from '@/types/response';

import {
  createGuestbookMessage,
  deleteGuestbookMessage,
  editGuestbookMessage,
  verifyGuestbookPassword,
} from '../services/guestbook.service';
import {
  CreateGuestbookDto,
  DeleteGuestbookDto,
  EditGuestbookDto,
  VerifiedGuestbookData,
} from '../type';

// 방명록 1페이지는 `/` ISR HTML에 포함되므로, 변경 성공 시 메인 페이지를 무효화한다.
const PORTFOLIO_PATH = '/';

export async function createGuestbookAction(payload: CreateGuestbookDto): Promise<ActionResponse> {
  const result = await createGuestbookMessage(payload);

  if (result.success) revalidatePath(PORTFOLIO_PATH);
  return result;
}

export async function editGuestbookAction(payload: EditGuestbookDto): Promise<ActionResponse> {
  const result = await editGuestbookMessage(payload);

  if (result.success) revalidatePath(PORTFOLIO_PATH);
  return result;
}

export async function deleteGuestbookAction(payload: DeleteGuestbookDto): Promise<ActionResponse> {
  const result = await deleteGuestbookMessage(payload);

  if (result.success) revalidatePath(PORTFOLIO_PATH);
  return result;
}

// 조회성 검증이라 캐시 무효화는 하지 않는다.
export async function verifyGuestbookPasswordAction(
  payload: DeleteGuestbookDto,
): Promise<ActionResponse<VerifiedGuestbookData>> {
  return verifyGuestbookPassword(payload);
}

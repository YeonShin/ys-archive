import bcrypt from 'bcryptjs';

import { createAdminClient } from '@/lib/supabase/admin';
import { createPublicClient } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/response';

import { GUESTBOOK_PAGE_SIZE } from '../constants/pagination';
import {
  CreateGuestbookDto,
  DeleteGuestbookDto,
  EditGuestbookDto,
  GuestbookResponse,
  VerifiedGuestbookData,
} from '../type';

const MAX_CONTENT_LENGTH = 200;
const BCRYPT_SALT_ROUNDS = 10;

interface StoredMessage {
  content: string | null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
}

// 수정/삭제/비밀번호 확인 공통: 대상 메시지를 찾고 비밀번호가 일치하는지 검증한다.
async function verifyMessagePassword(id: string, password: string): Promise<StoredMessage> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('guestbook')
    .select('password, content')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('[guestbook.service.verifyMessagePassword] Failed to fetch message:', error);
    throw new Error(`메시지를 찾을 수 없습니다. (에러: ${error?.message || 'No data'})`);
  }

  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');

  return { content: data.content };
}

export async function fetchGuestbookData(
  page = 1,
  limit = GUESTBOOK_PAGE_SIZE,
): Promise<GuestbookResponse | null> {
  const supabase = createPublicClient();

  const from = (page - 1) * limit;
  const to = from + limit;

  try {
    const { data, count, error } = await supabase
      .from('guestbook_public_view')
      .select('id, nickname, content, is_public, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !data) {
      console.error(
        '[guestbook.service.fetchGuestbookData] Failed to fetch guestbook data:',
        error,
      );
      return null;
    }

    return {
      data: data.map((item) => ({
        id: item.id ?? '',
        nickname: item.nickname ?? '',
        content: item.content ?? '',
        isPublic: item.is_public ?? false,
        createdAt: item.created_at ?? '',
        updatedAt: item.updated_at ?? '',
      })),
      totalCount: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('[guestbook.service.fetchGuestbookData] Unexpected error during fetch:', error);
    return null;
  }
}

export async function createGuestbookMessage(payload: CreateGuestbookDto): Promise<ActionResponse> {
  try {
    if (payload.content.length > MAX_CONTENT_LENGTH) {
      throw new Error('내용은 200자를 초과할 수 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);
    const supabase = await createClient();

    const { error } = await supabase.from('guestbook').insert({
      id: payload.id,
      nickname: payload.nickname,
      password: hashedPassword,
      content: payload.content,
      is_public: payload.isPublic,
    });

    if (error) {
      console.error('[guestbook.service.createGuestbookMessage] Insert error:', error);
      throw new Error('방명록 작성에 실패했습니다.');
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbook.service.createGuestbookMessage] Unexpected error:', error);
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function editGuestbookMessage(payload: EditGuestbookDto): Promise<ActionResponse> {
  try {
    if (payload.content && payload.content.length > MAX_CONTENT_LENGTH) {
      throw new Error('내용은 200자를 초과할 수 없습니다.');
    }

    await verifyMessagePassword(payload.id, payload.password);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('guestbook')
      .update({
        content: payload.content,
        is_public: payload.isPublic,
      })
      .eq('id', payload.id);

    if (error) throw new Error('방명록 수정에 실패했습니다.');

    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbook.service.editGuestbookMessage] Unexpected error:', error);
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteGuestbookMessage({
  id,
  password,
}: DeleteGuestbookDto): Promise<ActionResponse> {
  try {
    await verifyMessagePassword(id, password);

    const supabase = createAdminClient();
    const { error } = await supabase.from('guestbook').delete().eq('id', id);

    if (error) throw new Error('삭제 중 오류가 발생했습니다.');

    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbook.service.deleteGuestbookMessage] Unexpected error:', error);
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function verifyGuestbookPassword({
  id,
  password,
}: DeleteGuestbookDto): Promise<ActionResponse<VerifiedGuestbookData>> {
  try {
    const { content } = await verifyMessagePassword(id, password);

    return { success: true, data: { originalContent: content ?? undefined } };
  } catch (error: unknown) {
    console.error('[guestbook.service.verifyGuestbookPassword] Unexpected error:', error);
    return { success: false, message: getErrorMessage(error) };
  }
}

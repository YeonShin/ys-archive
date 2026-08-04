'use server';

import { revalidatePath } from 'next/cache';

import bcrypt from 'bcryptjs';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

import {
  CreateGuestbookDto,
  DeleteGuestbookDto,
  EditGuestbookDto,
  GuestbookResponse,
} from '../type';

export const fetchGuestbookData = async (
  page = 1,
  limit = 5,
): Promise<GuestbookResponse | null> => {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, count, error } = await supabase
      .from('guestbook_public_view')
      .select('id, nickname, content, is_public, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !data) {
      console.error('[guestbookApi.fetchGuestbookData] Failed to fetch gueestbook data:', error);
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
    console.error('[guestbookApi.fetchGuestbookData] Unexpected error during fetch:', error);
    return null;
  }
};

export const createGuestbookMessage = async (payload: CreateGuestbookDto) => {
  try {
    if (payload.content.length > 200) {
      throw new Error('내용은 200자를 초과할 수 없습니다.');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const supabase = await createClient();

    const { error } = await supabase.from('guestbook').insert({
      nickname: payload.nickname,
      password: hashedPassword,
      content: payload.content,
      is_public: payload.isPublic,
    });

    if (error) {
      console.error('[guestbookApi.createGuestbookMessage] Insert error:', error);
      throw new Error('방명록 작성에 실패했습니다.');
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbookApi.createGuestbookMessage] Unexpected error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return { success: false, message };
  }
};

export const editGuestbookMessage = async (payload: EditGuestbookDto) => {
  const supabase = createAdminClient();

  try {
    if (payload.content && payload.content.length > 200) {
      throw new Error('내용은 200자를 초과할 수 없습니다.');
    }

    const { data, error: fetchError } = await supabase
      .from('guestbook')
      .select('password')
      .eq('id', payload.id)
      .single();

    if (fetchError || !data) {
      console.error('Edit fetchError:', fetchError);
      throw new Error(`메시지를 찾을 수 없습니다. (에러: ${fetchError?.message || 'No data'})`);
    }

    const isValid = await bcrypt.compare(payload.password, data.password);
    if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');

    const { error: updateError } = await supabase
      .from('guestbook')
      .update({
        content: payload.content,
        is_public: payload.isPublic,
      })
      .eq('id', payload.id);

    if (updateError) throw new Error('방명록 수정에 실패했습니다.');

    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbookApi.editGuestbookMessage] Unexpected error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return { success: false, message };
  }
};

export const deleteGuestbookMessage = async ({ id, password }: DeleteGuestbookDto) => {
  const supabase = createAdminClient();

  try {
    const { data, error: fetchError } = await supabase
      .from('guestbook')
      .select('password')
      .eq('id', id)
      .single();

    if (fetchError || !data) {
      console.error('Delete fetchError:', fetchError);
      throw new Error(`메시지를 찾을 수 없습니다. (에러: ${fetchError?.message || 'No data'})`);
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');

    const { error: deleteError } = await supabase.from('guestbook').delete().eq('id', id);

    if (deleteError) throw new Error('삭제 중 오류가 발생했습니다.');

    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbookApi.deleteGuestbookMessage] Unexpected error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return { success: false, message };
  }
};

export const verifyPassword = async ({ id, password }: DeleteGuestbookDto) => {
  const supabase = createAdminClient();

  try {
    const { data, error: fetchError } = await supabase
      .from('guestbook')
      .select('password')
      .eq('id', id)
      .single();

    if (fetchError || !data) {
      console.error('Verify fetchError:', fetchError);
      throw new Error(`메시지를 찾을 수 없습니다. (에러: ${fetchError?.message || 'No data'})`);
    }

    const isValid = await bcrypt.compare(password, data.password);
    if (!isValid) throw new Error('비밀번호가 일치하지 않습니다.');

    return { success: true };
  } catch (error) {
    console.error('[guestbookApi.verifyGuestbookPassword] Unexpected error:', error);
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return { success: false, message };
  }
};

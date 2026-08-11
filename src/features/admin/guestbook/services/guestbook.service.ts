import { createAdminClient } from '@/lib/supabase/admin';

import { AdminGuestbookQuery } from '../types';

export const fetchAdminGuestbooks = async (query: AdminGuestbookQuery, limit = 10) => {
  try {
    const supabase = createAdminClient();
    const { page, search } = query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let request = supabase
      .from('guestbook')
      .select('id, nickname, content, is_public, created_at, updated_at', { count: 'exact' });

    if (search) {
      request = request.or(`nickname.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const res = await request.order('created_at', { ascending: false }).range(from, to);

    if (res.error) {
      throw res.error;
    }

    if (!res.data) {
      throw new Error('데이터를 불러오지 못했습니다.');
    }

    return {
      data: res.data.map((item) => ({
        id: item.id ?? '',
        nickname: item.nickname ?? '',
        content: item.content ?? '',
        isPublic: item.is_public ?? false,
        createdAt: item.created_at ?? '',
        updatedAt: item.updated_at ?? '',
      })),
      totalCount: res.count ?? 0,
      totalPages: Math.ceil((res.count ?? 0) / limit),
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error('[guestbook.service.fetchAdminGuestbooks] 에러 발생:', error);
    return null;
  }
};

export const deleteAdminGuestbook = async (id: string) => {
  try {
    const supabase = createAdminClient();
    const res = await supabase.from('guestbook').delete().eq('id', id);

    if (res.error) {
      throw res.error;
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('[guestbook.service.deleteAdminGuestbook] 에러 발생:', error);
    let errorMessage = 'DB 삭제 에러';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String(error.message);
    }
    return { success: false, message: errorMessage };
  }
};

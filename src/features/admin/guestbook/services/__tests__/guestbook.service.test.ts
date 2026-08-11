import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteAdminGuestbook, fetchAdminGuestbooks } from '../guestbook.service';

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(() => mockSupabase),
}));

describe('Admin Guestbook Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAdminGuestbooks', () => {
    const mockData = [
      {
        id: '1',
        nickname: 'User1',
        content: 'Hello',
        is_public: true,
        created_at: '2026-08-11T00:00:00Z',
        updated_at: '2026-08-11T00:00:00Z',
      },
      {
        id: '2',
        nickname: 'User2',
        content: 'Private message',
        is_public: false,
        created_at: '2026-08-10T00:00:00Z',
        updated_at: '2026-08-10T00:00:00Z',
      },
    ];

    it('페이지 및 limit에 맞게 방명록 전체 데이터를 조회해야 한다 (비공개 포함)', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: mockData, count: 2, error: null });

      const result = await fetchAdminGuestbooks({ page: 1, search: '' }, 10);

      expect(mockSupabase.from).toHaveBeenCalledWith('guestbook');
      expect(mockSupabase.select).toHaveBeenCalledWith(
        'id, nickname, content, is_public, created_at, updated_at',
        { count: 'exact' },
      );
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(mockSupabase.or).not.toHaveBeenCalled();
      expect(mockSupabase.range).toHaveBeenCalledWith(0, 9); // (page - 1) * limit, to + limit - 1

      expect(result).toEqual({
        data: [
          {
            id: '1',
            nickname: 'User1',
            content: 'Hello',
            isPublic: true,
            createdAt: '2026-08-11T00:00:00Z',
            updatedAt: '2026-08-11T00:00:00Z',
          },
          {
            id: '2',
            nickname: 'User2',
            content: 'Private message',
            isPublic: false,
            createdAt: '2026-08-10T00:00:00Z',
            updatedAt: '2026-08-10T00:00:00Z',
          },
        ],
        totalCount: 2,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it('검색어(search)가 주어졌을 때 nickname 또는 content 기준으로 필터링해야 한다', async () => {
      mockSupabase.range.mockResolvedValueOnce({ data: [mockData[0]], count: 1, error: null });

      const result = await fetchAdminGuestbooks({ page: 1, search: 'User1' }, 10);

      expect(mockSupabase.from).toHaveBeenCalledWith('guestbook');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.or).toHaveBeenCalledWith('nickname.ilike.%User1%,content.ilike.%User1%');
      expect(mockSupabase.order).toHaveBeenCalled();
      expect(mockSupabase.range).toHaveBeenCalledWith(0, 9);

      expect(result?.totalCount).toBe(1);
      expect(result?.data).toHaveLength(1);
    });

    it('데이터 조회 중 에러 발생 시 null을 반환해야 한다', async () => {
      mockSupabase.range.mockResolvedValueOnce({
        data: null,
        count: null,
        error: { message: 'DB Error' },
      });

      const result = await fetchAdminGuestbooks({ page: 1, search: '' }, 10);

      expect(result).toBeNull();
    });
  });

  describe('deleteAdminGuestbook', () => {
    it('지정된 id의 방명록을 삭제하고 성공 결과를 반환해야 한다', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: null });

      const result = await deleteAdminGuestbook('1');

      expect(mockSupabase.from).toHaveBeenCalledWith('guestbook');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '1');
      expect(result).toEqual({ success: true });
    });

    it('삭제 중 에러가 발생하면 실패 결과와 메시지를 반환해야 한다', async () => {
      mockSupabase.eq.mockResolvedValueOnce({ error: { message: 'Delete Error' } });

      const result = await deleteAdminGuestbook('1');

      expect(result).toEqual({ success: false, message: 'Delete Error' });
    });
  });
});

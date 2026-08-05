import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/server';

import { getDashboardStats } from '../dashboard.service';

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(() => []),
  }),
}));

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('오늘 작성된 방명록 수, 최근 업데이트 일자, 방문자수를 성공적으로 반환해야 한다', async () => {
      server.use(
        http.get(/rest\/v1\/portfolio_content/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-01T00:00:00Z' }]);
        }),
        http.get(/rest\/v1\/projects/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-05T00:00:00Z' }]);
        }),
        http.get(/rest\/v1\/tech_stacks/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-04T00:00:00Z' }]);
        }),
        http.get(/rest\/v1\/experiences/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-02T00:00:00Z' }]);
        }),
        http.head(/rest\/v1\/guestbook/, () => {
          return new HttpResponse(null, { status: 200, headers: { 'Content-Range': '0-0/1' } });
        }),
      );

      const result = await getDashboardStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.recentUpdateDate).toBeDefined();
      expect(result.data?.todayGuestbookCount).toBeDefined();
      expect(result.data?.totalVisitors).toBeDefined();
      expect(result.data?.todayVisitors).toBeDefined();
    });

    it('통계 데이터를 불러오는 데 실패할 경우 에러 메시지를 반환해야 한다', async () => {
      server.use(
        http.get(/rest\/v1\/portfolio_content/, () => {
          return HttpResponse.json({ message: 'Database error' }, { status: 500 });
        }),
        http.get(/rest\/v1\/projects/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-05T00:00:00Z' }]);
        }),
        http.get(/rest\/v1\/tech_stacks/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-04T00:00:00Z' }]);
        }),
        http.get(/rest\/v1\/experiences/, () => {
          return HttpResponse.json([{ updated_at: '2026-08-02T00:00:00Z' }]);
        }),
      );

      const result = await getDashboardStats();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

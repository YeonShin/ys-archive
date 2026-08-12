import { HttpResponse, http } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/server';

import {
  fetchVercelVisitorStats,
  getDashboardStats,
  getRecentAdminGuestbooks,
} from '../dashboard.service';

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

  describe('fetchVercelVisitorStats', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('토큰이나 프로젝트 ID가 환경 변수에 없으면 0을 반환해야 한다', async () => {
      // 환경변수가 없는 상태 시뮬레이션
      vi.stubEnv('VERCEL_ACCESS_TOKEN', '');
      vi.stubEnv('VERCEL_PROJECT_ID', '');

      const result = await fetchVercelVisitorStats();

      expect(result).toEqual({ totalVisitors: 0, todayVisitors: 0, chartData: [] });
    });

    it('Vercel API 호출에 실패할 경우 크래시 없이 0을 반환해야 한다', async () => {
      vi.stubEnv('VERCEL_ACCESS_TOKEN', 'test-token');
      vi.stubEnv('VERCEL_PROJECT_ID', 'test-project');

      server.use(
        http.get('https://api.vercel.com/v1/query/web-analytics/visits/aggregate', () => {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }),
      );

      const result = await fetchVercelVisitorStats();
      expect(result).toEqual({ totalVisitors: 0, todayVisitors: 0, chartData: [] });
    });

    it('Vercel API를 정상적으로 호출하여 통계를 반환해야 한다', async () => {
      vi.stubEnv('VERCEL_ACCESS_TOKEN', 'test-token');
      vi.stubEnv('VERCEL_PROJECT_ID', 'test-project');

      // 성공 Mock
      server.use(
        http.get('https://api.vercel.com/v1/query/web-analytics/visits/count', () => {
          return HttpResponse.json({
            data: {
              visitors: 1500,
            },
          });
        }),
        http.get('https://api.vercel.com/v1/query/web-analytics/visits/aggregate', () => {
          return HttpResponse.json({
            data: [
              { timestamp: '2026-08-11T16:00:00.000Z', visitors: 50 },
              { timestamp: '2026-08-11T17:00:00.000Z', visitors: 50 },
            ],
          });
        }),
      );

      const result = await fetchVercelVisitorStats();
      expect(result).toEqual({
        totalVisitors: 1500, // mock count API
        todayVisitors: 100, // mock aggregate API sum
        chartData: expect.any(Array),
      });
    });
  });

  describe('getRecentAdminGuestbooks', () => {
    it('지정된 수만큼 방명록 데이터를 성공적으로 반환해야 한다', async () => {
      const mockData = [
        {
          id: 1,
          nickname: 'User1',
          content: 'Msg1',
          is_public: true,
          created_at: '2026-08-05',
          updated_at: '2026-08-05',
        },
        {
          id: 2,
          nickname: 'User2',
          content: 'Msg2',
          is_public: false,
          created_at: '2026-08-04',
          updated_at: '2026-08-04',
        },
      ];

      server.use(
        http.get(/rest\/v1\/guestbook/, () => {
          return HttpResponse.json(mockData);
        }),
      );

      const result = await getRecentAdminGuestbooks(2);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]?.nickname).toBe('User1');
      expect(result.data?.[1]?.isPublic).toBe(false);
    });

    it('데이터 조회 실패 시 에러 응답을 반환해야 한다', async () => {
      server.use(
        http.get(/rest\/v1\/guestbook/, () => {
          return HttpResponse.json({ message: 'Database error' }, { status: 500 });
        }),
      );

      const result = await getRecentAdminGuestbooks();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/server';

import { loginAdminAction, logoutAdminAction } from '../auth.action';

// Next.js의 cookies() 모킹
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    getAll: vi.fn(),
  }),
}));

describe('Auth Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginAdminAction', () => {
    it('올바른 자격 증명일 경우 성공 상태를 반환해야 한다', async () => {
      // MSW로 Supabase Auth 성공 응답 모킹
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json({
            access_token: 'valid-token',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'valid-refresh',
            user: { id: 'test-admin', aud: 'authenticated', role: 'authenticated' },
          });
        }),
      );

      const formData = new FormData();
      formData.append('email', 'admin@example.com');
      formData.append('password', 'password123');

      const result = await loginAdminAction(formData);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('잘못된 자격 증명일 경우 에러 메시지를 반환해야 한다', async () => {
      // MSW로 Supabase Auth 실패 응답 모킹
      server.use(
        http.post('*/auth/v1/token', () => {
          return HttpResponse.json(
            { error: 'invalid_credentials', error_description: 'Invalid login credentials' },
            { status: 400 },
          );
        }),
      );

      const formData = new FormData();
      formData.append('email', 'wrong@example.com');
      formData.append('password', 'wrongpass');

      const result = await loginAdminAction(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid login credentials');
    });
  });

  describe('logoutAdminAction', () => {
    it('로그아웃 시 성공 상태를 반환해야 한다', async () => {
      server.use(
        http.post('*/auth/v1/logout', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const result = await logoutAdminAction();
      expect(result.success).toBe(true);
    });
  });
});

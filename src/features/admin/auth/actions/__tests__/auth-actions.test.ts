import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/mocks/server';

import {
  loginAdminAction,
  logoutAdminAction,
  resetPasswordAction,
  updatePasswordAction,
} from '../auth.action';

const mockCookieStore: Record<string, string> = {};

// Next.js의 cookies() 모킹
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn((name: string) =>
      mockCookieStore[name] ? { name, value: mockCookieStore[name] } : undefined,
    ),
    set: vi.fn((name: string, value: string) => {
      mockCookieStore[name] = value;
    }),
    remove: vi.fn((name: string) => {
      delete mockCookieStore[name];
    }),
    getAll: vi.fn(() => Object.entries(mockCookieStore).map(([name, value]) => ({ name, value }))),
  }),
}));

describe('Auth Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key in mockCookieStore) {
      delete mockCookieStore[key];
    }
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

      const formData = { email: 'admin@example.com', password: 'password123' };

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

      const formData = { email: 'InvalidEmail@email.com', password: 'invalid123' };

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

  describe('resetPasswordAction', () => {
    it('유효한 이메일일 경우 비밀번호 재설정 이메일을 발송하고 성공 상태를 반환해야 한다', async () => {
      server.use(
        http.post('*/auth/v1/recover', () => {
          return HttpResponse.json({}, { status: 200 });
        }),
      );

      const result = await resetPasswordAction('admin@example.com');
      expect(result.success).toBe(true);
    });

    it('이메일 발송에 실패할 경우 에러 메시지를 반환해야 한다', async () => {
      server.use(
        http.post('*/auth/v1/recover', () => {
          return HttpResponse.json(
            { error: 'not_found', error_description: 'User not found' },
            { status: 404 },
          );
        }),
      );

      const result = await resetPasswordAction('invalid@example.com');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User not found');
    });
  });

  describe('updatePasswordAction', () => {
    beforeEach(async () => {
      // updatePassword는 세션이 필요하므로 먼저 로그인을 수행하여 쿠키에 세션을 저장합니다.
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
      await loginAdminAction({ email: 'admin@example.com', password: 'password123' });
    });

    it('새 비밀번호로 성공적으로 업데이트하면 성공 상태를 반환해야 한다', async () => {
      server.use(
        http.put('*/auth/v1/user', () => {
          return HttpResponse.json(
            {
              id: 'test-admin',
              aud: 'authenticated',
              role: 'authenticated',
            },
            { status: 200 },
          );
        }),
      );

      const result = await updatePasswordAction('newPassword123!');
      expect(result.success).toBe(true);
    });

    it('비밀번호 업데이트에 실패할 경우 에러 메시지를 반환해야 한다', async () => {
      server.use(
        http.put('*/auth/v1/user', () => {
          return HttpResponse.json(
            {
              error: 'weak_password',
              error_description: 'Password should be at least 6 characters',
            },
            { status: 400 },
          );
        }),
      );

      const result = await updatePasswordAction('123');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Password should be at least 6 characters');
    });
  });
});

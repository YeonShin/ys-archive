import { NextRequest, NextResponse } from 'next/server';

import * as ssr from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

import { proxy } from '../proxy';

// Supabase 클라이언트 모킹
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();

  const mockCookies = {
    set: vi.fn(),
    getAll: vi.fn().mockReturnValue([]),
  };

  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      redirect: vi.fn().mockImplementation((url: string | URL) => ({
        status: 307,
        url: url.toString(),
        cookies: mockCookies,
      })),
      next: vi.fn().mockImplementation(() => ({
        status: 200,
        cookies: mockCookies,
      })),
    },
  };
});

describe('proxy (Next.js 16 Route Guard 미들웨어)', () => {
  let mockGetUser: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Supabase의 auth.getUser() 함수 모킹 세팅
    mockGetUser = vi.fn();

    // createServerClient가 반환하는 거대한 객체 중 테스트에 필요한 auth.getUser만 부분 모킹
    vi.mocked(ssr.createServerClient).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    } as unknown as SupabaseClient); // any 대신 unknown을 거친 안전한 단언 사용
  });

  it('인증되지 않은 사용자가 /admin 에 접근 시 /admin/login 으로 리다이렉트 된다', async () => {
    // 유저 정보가 없는 상태(비로그인)로 가정
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const req = new NextRequest('http://localhost:3000/admin/dashboard');
    await proxy(req);

    // 로그인을 안 했으므로 리다이렉트가 일어나야 함
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = vi.mocked(NextResponse.redirect).mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe('/admin/login');
  });

  it('인증된 사용자가 /admin 에 접근 시 그대로 통과(next) 된다', async () => {
    // 정상적으로 유저 정보가 존재하는 상태로 가정
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin123' } } });

    const req = new NextRequest('http://localhost:3000/admin/dashboard');
    await proxy(req);

    // 올바른 유저이므로 리다이렉트가 발생하면 안 됨
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });

  it('인증된 사용자가 /admin/login 에 접근 시 /admin 으로 리다이렉트 된다', async () => {
    // 이미 로그인한 유저
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin123' } } });

    const req = new NextRequest('http://localhost:3000/admin/login');
    await proxy(req);

    // 로그인 페이지에 굳이 들어갈 필요가 없으므로 대시보드로 보냄
    expect(NextResponse.redirect).toHaveBeenCalled();
    const redirectUrl = vi.mocked(NextResponse.redirect).mock.calls[0][0] as URL;
    expect(redirectUrl.pathname).toBe('/admin');
  });
});

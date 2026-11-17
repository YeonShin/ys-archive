import { type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  // 어드민 경로 요청에 대해 Supabase 세션을 동기화 및 갱신 및 접근 제어
  return await updateSession(request);
}

export const config = {
  matcher: [
    // 공개 페이지(/)는 세션이 불필요하며 ISR CDN 캐시를 바로 타도록 어드민 경로만 매칭
    '/admin/:path*',
  ],
};

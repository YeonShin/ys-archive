import { type NextRequest, NextResponse } from 'next/server';

import { GUESTBOOK_PAGE_SIZE } from '@/features/portfolio/guestbook/constants/pagination';
import { fetchGuestbookData } from '@/features/portfolio/guestbook/services/guestbook.service';
import { parseGuestbookPage } from '@/features/portfolio/guestbook/utils/guestbookPage';

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' };

// 방명록 페이지 조회 API Route (2페이지 이상, 클라이언트 페이지네이션용).
// 1페이지는 `/` ISR HTML에 포함되어 서빙된다.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const page = parseGuestbookPage(request.nextUrl.searchParams.get('page') ?? '1');

  if (page === null) {
    return NextResponse.json(
      { message: '유효하지 않은 페이지 번호입니다.' },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const guestbook = await fetchGuestbookData(page, GUESTBOOK_PAGE_SIZE);

  if (!guestbook) {
    return NextResponse.json(
      { message: '방명록을 불러오지 못했습니다.' },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json(guestbook, { headers: NO_STORE_HEADERS });
}

import { GUESTBOOK_MAX_PAGE } from '../constants/pagination';
import { GuestbookResponse } from '../type';

// 페이지 번호 문자열(URL 해시, API 쿼리)을 유효한 페이지 번호로 변환한다. 유효하지 않으면 null.
export const parseGuestbookPage = (value: string | null): number | null => {
  if (value === null || !/^\d+$/.test(value)) return null;

  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1 || page > GUESTBOOK_MAX_PAGE) return null;

  return page;
};

// 스크린 리더(aria-live)에 알릴 페이지 전환 상태 문구.
// 총 페이지 수는 글 작성/삭제로도 바뀌어 불필요한 안내가 되므로 문구에 넣지 않는다.
export const getPageStatusMessage = (
  page: number,
  isLoading: boolean,
  hasError: boolean,
): string => {
  // 조회 실패는 role="alert"가 알린다.
  if (hasError) return '';

  return isLoading
    ? `방명록 ${page}페이지를 불러오는 중입니다.`
    : `방명록 ${page}페이지를 불러왔습니다.`;
};

// 같은 출처의 자체 API 응답이므로 구조만 확인한다.
export const isGuestbookResponse = (value: unknown): value is GuestbookResponse =>
  typeof value === 'object' &&
  value !== null &&
  'data' in value &&
  Array.isArray(value.data) &&
  'totalCount' in value &&
  typeof value.totalCount === 'number' &&
  'totalPages' in value &&
  typeof value.totalPages === 'number' &&
  'currentPage' in value &&
  typeof value.currentPage === 'number';

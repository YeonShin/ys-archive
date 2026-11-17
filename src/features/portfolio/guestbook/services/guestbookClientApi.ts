import { GuestbookResponse } from '../type';
import { isGuestbookResponse } from '../utils/guestbookPage';

export const fetchGuestbookPage = async (
  page: number,
  signal?: AbortSignal,
): Promise<GuestbookResponse> => {
  const response = await fetch(`/api/guestbook?page=${page}`, { signal });

  if (!response.ok) {
    throw new Error(`방명록 조회에 실패했습니다. (status: ${response.status})`);
  }

  const body: unknown = await response.json();
  if (!isGuestbookResponse(body)) {
    throw new Error('방명록 응답 형식이 올바르지 않습니다.');
  }

  return body;
};

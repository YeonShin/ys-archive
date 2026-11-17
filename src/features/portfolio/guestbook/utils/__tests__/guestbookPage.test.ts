import { describe, expect, it } from 'vitest';

import { GUESTBOOK_MAX_PAGE } from '../../constants/pagination';
import { parseGuestbookPage } from '../guestbookPage';

describe('parseGuestbookPage', () => {
  it('유효한 페이지 번호를 숫자로 변환한다', () => {
    expect(parseGuestbookPage('1')).toBe(1);
    expect(parseGuestbookPage('3')).toBe(3);
    expect(parseGuestbookPage(String(GUESTBOOK_MAX_PAGE))).toBe(GUESTBOOK_MAX_PAGE);
  });

  it.each([null, '', '0', '-1', 'abc', '1.5', ' 2', '1e3', String(GUESTBOOK_MAX_PAGE + 1)])(
    '유효하지 않은 값 %s 은 null을 반환한다',
    (value) => {
      expect(parseGuestbookPage(value)).toBeNull();
    },
  );
});

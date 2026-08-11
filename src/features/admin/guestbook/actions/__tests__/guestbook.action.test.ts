import { revalidatePath } from 'next/cache';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteAdminGuestbook } from '../../services/guestbook.service';
import { deleteAdminGuestbookAction } from '../guestbook.action';

vi.mock('../../services/guestbook.service', () => ({
  deleteAdminGuestbook: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Admin Guestbook Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteAdminGuestbookAction', () => {
    it('방명록 삭제 성공 시 revalidatePath를 호출하고 success:true를 반환해야 한다', async () => {
      vi.mocked(deleteAdminGuestbook).mockResolvedValue({ success: true });

      const result = await deleteAdminGuestbookAction(null, '1');

      expect(result.success).toBe(true);
      expect(deleteAdminGuestbook).toHaveBeenCalledWith('1');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/guestbook');
      expect(revalidatePath).toHaveBeenCalledWith('/'); // 포트폴리오 메인 페이지 무효화
    });

    it('방명록 삭제 실패 시 에러 결과를 반환해야 한다', async () => {
      vi.mocked(deleteAdminGuestbook).mockResolvedValue({ success: false, message: '삭제 실패' });

      const result = await deleteAdminGuestbookAction(null, '1');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('삭제 실패');
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});

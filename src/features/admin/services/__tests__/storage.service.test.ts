import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteFile } from '../storage.service';

// Supabase mock
const mockUpload = vi.fn();
const mockRemove = vi.fn();
const mockGetPublicUrl = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    storage: {
      from: vi.fn((bucket: string) => {
        if (bucket === 'portfolio-assets') {
          return {
            upload: mockUpload,
            remove: mockRemove,
            getPublicUrl: mockGetPublicUrl.mockReturnValue({
              data: { publicUrl: 'https://example.com/file.png' },
            }),
          };
        }
        return {};
      }),
    },
  })),
}));

describe('Storage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deleteFile', () => {
    it('파일 삭제에 성공해야 한다', async () => {
      mockRemove.mockResolvedValueOnce({ error: null });

      const result = await deleteFile('profile/test.png');

      expect(result.success).toBe(true);
      expect(mockRemove).toHaveBeenCalledWith(['profile/test.png']);
    });

    it('파일 삭제 중 오류 발생 시 에러를 반환해야 한다', async () => {
      mockRemove.mockResolvedValueOnce({ error: { message: 'Remove Failed' } });

      const result = await deleteFile('profile/test.png');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Remove Failed');
    });
  });
});

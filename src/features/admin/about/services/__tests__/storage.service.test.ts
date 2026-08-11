import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteFile, uploadFile } from '../storage.service';

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

describe('Storage Action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('파일 업로드에 성공하면 URL을 반환해야 한다', async () => {
      mockUpload.mockResolvedValueOnce({ error: null });

      const formData = new FormData();
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      formData.append('file', file);

      const result = await uploadFile(formData, 'profile');

      expect(result.success).toBe(true);
      expect(result.url).toBe('https://example.com/file.png');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringContaining('profile/'),
        file,
        expect.any(Object),
      );
    });

    it('파일이 없을 경우 에러를 반환해야 한다', async () => {
      const formData = new FormData();

      const result = await uploadFile(formData, 'profile');

      expect(result.success).toBe(false);
      expect(result.error).toBe('파일이 제공되지 않았습니다.');
    });

    it('업로드 중 오류 발생 시 에러를 반환해야 한다', async () => {
      mockUpload.mockResolvedValueOnce({ error: { message: 'Upload Failed' } });

      const formData = new FormData();
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      formData.append('file', file);

      const result = await uploadFile(formData, 'profile');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Upload Failed');
    });
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

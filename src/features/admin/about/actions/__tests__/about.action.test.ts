import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteFile } from '../../../services/storage.service';
import { updateAboutData } from '../../services/about.service';
import { AboutFormData } from '../../types';
import { submitAboutFormAction } from '../about.action';

vi.mock('../../services/about.service', () => ({
  updateAboutData: vi.fn(),
}));

vi.mock('../../../services/storage.service', () => ({
  deleteFile: vi.fn(() => Promise.resolve({ success: true })),
}));

describe('About Action - submitAboutFormAction', () => {
  const mockData: AboutFormData = {
    portfolioContent: {
      developer_role: 'Test Role',
      hero_title: 'Test Title',
      hero_description: 'Test Description',
      about_text: 'Test About Text',
      profile_image_url: 'https://example.com/new.jpg',
      resume_url: 'https://example.com/new.pdf',
    },
    contacts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('DB 업데이트에 성공하고 success:true를 반환해야 한다', async () => {
    vi.mocked(updateAboutData).mockResolvedValue({ success: true });

    const result = await submitAboutFormAction(mockData, [], []);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockData);
    }
    expect(updateAboutData).toHaveBeenCalledWith(mockData);
  });

  it('업데이트 성공 시 urlsToDeleteOnSuccess에 포함된 기존 파일을 삭제해야 한다', async () => {
    vi.mocked(updateAboutData).mockResolvedValue({ success: true });

    const result = await submitAboutFormAction(mockData, [], ['old.jpg', 'old.pdf']);

    expect(result.success).toBe(true);
    expect(deleteFile).toHaveBeenCalledWith('old.jpg');
    expect(deleteFile).toHaveBeenCalledWith('old.pdf');
  });

  it('DB 업데이트 실패 시 uploadedUrlsToRollback에 포함된 새로 업로드된 파일을 삭제해야 한다', async () => {
    vi.mocked(updateAboutData).mockResolvedValue({ success: false, error: 'DB 에러' });

    const result = await submitAboutFormAction(mockData, ['new.jpg', 'new.pdf'], []);

    expect(result.success).toBe(false);
    expect(deleteFile).toHaveBeenCalledWith('new.jpg');
    expect(deleteFile).toHaveBeenCalledWith('new.pdf');
  });

  it('예기치 않은 예외 발생 시 새로 업로드된 파일을 삭제하고 에러를 반환해야 한다', async () => {
    vi.mocked(updateAboutData).mockRejectedValue(new Error('네트워크 오류'));

    const result = await submitAboutFormAction(mockData, ['new.jpg'], []);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('네트워크 오류');
    }
    expect(deleteFile).toHaveBeenCalledWith('new.jpg');
  });
});

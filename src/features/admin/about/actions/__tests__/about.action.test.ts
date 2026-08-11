import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updateAboutData } from '../../services/about.service';
import { deleteFile, uploadFile } from '../../services/storage.service';
import { AboutFormData } from '../../types';
import { submitAboutFormAction } from '../about.action';

vi.mock('../../services/about.service', () => ({
  updateAboutData: vi.fn(),
}));

vi.mock('../../services/storage.service', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
}));

describe('About Action - submitAboutFormAction', () => {
  let mockFormData: FormData;
  const mockData: AboutFormData = {
    portfolioContent: {
      developer_role: 'Test Role',
      hero_title: 'Test Title',
      hero_description: 'Test Description',
      about_text: 'Test About Text',
      profile_image_url:
        'https://test.supabase.co/storage/v1/object/public/portfolio-assets/profile/old.jpg',
      resume_url:
        'https://test.supabase.co/storage/v1/object/public/portfolio-assets/resumes/old.pdf',
    },
    contacts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormData = new FormData();
    mockFormData.append('data', JSON.stringify(mockData));
  });

  it('데이터가 정상적으로 파싱되고 DB 업데이트에 성공해야 한다', async () => {
    vi.mocked(updateAboutData).mockResolvedValue({ success: true });

    const result = await submitAboutFormAction(mockFormData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockData);
    }
    expect(updateAboutData).toHaveBeenCalledWith(mockData);
  });

  it('새 프로필 이미지와 이력서를 성공적으로 업로드하고, 기존 파일을 삭제해야 한다', async () => {
    vi.mocked(updateAboutData).mockResolvedValue({ success: true });
    vi.mocked(uploadFile)
      .mockResolvedValueOnce({
        success: true,
        url: 'https://test.supabase.co/storage/v1/object/public/portfolio-assets/profile/new.jpg',
      }) // profileImage
      .mockResolvedValueOnce({
        success: true,
        url: 'https://test.supabase.co/storage/v1/object/public/portfolio-assets/resumes/new.pdf',
      }); // resume
    vi.mocked(deleteFile).mockResolvedValue({ success: true });

    mockFormData.append('profileImage', new File([''], 'new.jpg', { type: 'image/jpeg' }));
    mockFormData.append('resume', new File([''], 'new.pdf', { type: 'application/pdf' }));

    const result = await submitAboutFormAction(mockFormData);

    expect(result.success).toBe(true);
    expect(uploadFile).toHaveBeenCalledTimes(2);
    // 기존 파일 삭제 (old.jpg, old.pdf)
    expect(deleteFile).toHaveBeenCalledWith('profile/old.jpg');
    expect(deleteFile).toHaveBeenCalledWith('resumes/old.pdf');
  });

  it('프로필 이미지 업로드 실패 시 즉시 에러를 반환해야 한다', async () => {
    vi.mocked(uploadFile).mockResolvedValueOnce({ success: false, error: '업로드 에러' });
    mockFormData.append('profileImage', new File([''], 'new.jpg', { type: 'image/jpeg' }));

    const result = await submitAboutFormAction(mockFormData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('업로드 에러');
    }
    expect(updateAboutData).not.toHaveBeenCalled();
  });

  it('DB 업데이트 실패 시 새로 업로드된 파일들을 롤백(삭제)해야 한다', async () => {
    vi.mocked(uploadFile)
      .mockResolvedValueOnce({
        success: true,
        url: 'https://test.supabase.co/storage/v1/object/public/portfolio-assets/profile/new.jpg',
      })
      .mockResolvedValueOnce({
        success: true,
        url: 'https://test.supabase.co/storage/v1/object/public/portfolio-assets/resumes/new.pdf',
      });

    vi.mocked(updateAboutData).mockResolvedValue({ success: false, error: 'DB 에러' });
    vi.mocked(deleteFile).mockResolvedValue({ success: true });

    mockFormData.append('profileImage', new File([''], 'new.jpg', { type: 'image/jpeg' }));
    mockFormData.append('resume', new File([''], 'new.pdf', { type: 'application/pdf' }));

    const result = await submitAboutFormAction(mockFormData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('DB 에러');
    }

    // DB 업데이트 실패로 인해 롤백 발생 (새 파일들 삭제)
    expect(deleteFile).toHaveBeenCalledWith('profile/new.jpg');
    expect(deleteFile).toHaveBeenCalledWith('resumes/new.pdf');
  });

  it('예기치 않은 예외 발생 시 새로 업로드된 파일들을 삭제하고 에러를 반환해야 한다', async () => {
    vi.mocked(uploadFile).mockResolvedValueOnce({
      success: true,
      url: 'https://test.supabase.co/storage/v1/object/public/portfolio-assets/profile/new.jpg',
    });
    vi.mocked(updateAboutData).mockRejectedValue(new Error('네트워크 끊김'));
    vi.mocked(deleteFile).mockResolvedValue({ success: true });

    mockFormData.append('profileImage', new File([''], 'new.jpg', { type: 'image/jpeg' }));

    const result = await submitAboutFormAction(mockFormData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('네트워크 끊김');
    }

    // 에러 발생으로 인해 롤백 발생 (새 파일 삭제)
    expect(deleteFile).toHaveBeenCalledWith('profile/new.jpg');
  });
});

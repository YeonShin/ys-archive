import { revalidatePath } from 'next/cache';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  deleteFile,
  deleteFolder,
  uploadFile,
} from '@/features/admin/about/services/storage.service';

import { createProject, deleteProject, updateProject } from '../../services/projects.service';
import { ProjectFormData } from '../../types';
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
  uploadImageAction,
} from '../projects.action';

vi.mock('../../services/projects.service', () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

vi.mock('@/features/admin/about/services/storage.service', () => ({
  uploadFile: vi.fn(),
  deleteFile: vi.fn(),
  deleteFolder: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Projects Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validFormData: ProjectFormData = {
    title: 'Test',
    subtitle: 'Test',
    status: 'IN_PROGRESS',
    started_at: '2026-01-01',
    role: 'Frontend',
    thumbnail_url: 'https://example.com/thumb.jpg',
    tech_stacks: [{ name: 'React', reason: '선정 이유' }],
    images: [{ value: 'https://example.com/img1.jpg' }],
    description: 'Project Desc',
    architecture: [
      { name: 'ERD', caption: 'ERD 입니다', url: 'https://example.com/architecture1.jpg' },
    ],
    key_features: [{ title: '사용자 인증 기능 구현', desc: [{ value: '세부 사항1' }] }],
    troubleshooting: [
      {
        title: '트러블 슈팅1',
        problem: '문제 상황',
        cause: '문제 분석',
        process: '문제 개선 과정',
        result: '문제 해결 결과',
        images: [{ url: 'https://example.com/troubleshooting1.jpg', caption: '이미지 설명' }],
      },
    ],
    priority: 1,
  };

  describe('createProjectAction', () => {
    it('프로젝트 생성 성공 시 revalidatePath를 호출하고 success:true를 반환해야 한다', async () => {
      vi.mocked(createProject).mockResolvedValue({ success: true, message: '생성 완료' });

      const result = await createProjectAction(null, validFormData);

      expect(result.success).toBe(true);
      expect(createProject).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/projects');
    });

    it('프로젝트 생성 실패 시 롤백을 수행하고 에러를 반환해야 한다', async () => {
      vi.mocked(createProject).mockRejectedValue(new Error('DB Error'));
      vi.mocked(deleteFile).mockResolvedValue({ success: true });

      // Action takes uploaded URLs to rollback in case of DB failure
      const result = await createProjectAction(null, validFormData, [
        'https://example.com/thumb.jpg',
      ]);

      expect(result.success).toBe(false);
      expect(result.message).toBe('DB Error');
      // Rollback check
      expect(deleteFile).toHaveBeenCalledWith('https://example.com/thumb.jpg');
    });
  });

  describe('updateProjectAction', () => {
    it('프로젝트 업데이트 성공 시 success:true를 반환해야 한다', async () => {
      vi.mocked(updateProject).mockResolvedValue({ success: true, message: '수정 완료' });

      const result = await updateProjectAction(null, '1', validFormData);

      expect(result.success).toBe(true);
      expect(updateProject).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/projects');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/projects/1');
    });

    it('프로젝트 업데이트 실패 시 롤백 수행 후 에러를 반환해야 한다', async () => {
      vi.mocked(updateProject).mockRejectedValue(new Error('Update Error'));

      const result = await updateProjectAction(null, '1', validFormData, [
        'https://example.com/new.jpg',
      ]);

      expect(result.success).toBe(false);
      expect(deleteFile).toHaveBeenCalledWith('https://example.com/new.jpg');
    });
  });

  describe('deleteProjectAction', () => {
    it('프로젝트 삭제 성공 시 success:true를 반환해야 한다', async () => {
      vi.mocked(deleteProject).mockResolvedValue({ success: true, message: '삭제 완료' });
      vi.mocked(deleteFolder).mockResolvedValue({ success: true });

      const result = await deleteProjectAction(null, '1');

      expect(result.success).toBe(true);
      expect(deleteProject).toHaveBeenCalledWith('1');
      // Ensure associated images are deleted via folder deletion
      expect(deleteFolder).toHaveBeenCalledWith('projects/1');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/projects');
    });
  });

  describe('uploadImageAction', () => {
    it('이미지 업로드 성공 시 url과 함께 success:true를 반환해야 한다', async () => {
      vi.mocked(uploadFile).mockResolvedValue({
        success: true,
        url: 'https://example.com/thumb.jpg',
      });

      const mockFormData = new FormData();
      mockFormData.append('file', new File([''], 'test.png'));

      const result = await uploadImageAction(mockFormData, 'projects/123/thumbnails');

      expect(result.success).toBe(true);
      expect(result.url).toBe('https://example.com/thumb.jpg');
      expect(uploadFile).toHaveBeenCalledWith(mockFormData, 'projects/123/thumbnails');
    });

    it('이미지 업로드 실패 시 에러 메시지와 함께 success:false를 반환해야 한다', async () => {
      vi.mocked(uploadFile).mockResolvedValue({ success: false, error: '업로드 실패' });

      const mockFormData = new FormData();
      const result = await uploadImageAction(mockFormData, 'projects/123/thumbnails');

      expect(result.success).toBe(false);
      expect(result.message).toBe('업로드 실패');
    });

    it('예기치 않은 예외 발생 시 에러 메시지를 반환해야 한다', async () => {
      vi.mocked(uploadFile).mockRejectedValue(new Error('Network Error'));

      const mockFormData = new FormData();
      const result = await uploadImageAction(mockFormData);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Network Error');
    });
  });
});

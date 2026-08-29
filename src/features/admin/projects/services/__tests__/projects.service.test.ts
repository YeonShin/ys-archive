import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InsertProjectDto, Project, UpdateProjectDto } from '../../types';
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsList,
  updateProject,
} from '../projects.service';

// Mock 체이닝
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockSelect = vi.fn(() => ({
  order: mockOrder,
  eq: mockEq,
  single: mockSingle,
}));

mockEq.mockImplementation(() => ({
  single: mockSingle,
  select: mockSelect,
}));

const mockInsert = vi.fn(() => ({ select: mockSelect }));
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockDelete = vi.fn(() => ({ eq: mockEq }));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'projects') {
        return {
          select: mockSelect,
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
        };
      }
      return {};
    }),
  })),
}));

describe('Projects Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // DB 스키마 형식의 Project
  const validProject: Project = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Project',
    subtitle: 'A simple test project',
    status: 'IN_PROGRESS',
    started_at: '2026-01-01',
    ended_at: null,
    role: 'Frontend Developer',
    links: [{ label: 'Github', url: 'https://github.com' }],
    thumbnail_url: 'https://example.com/thumb.jpg',
    tech_stacks: [{ name: 'React', reason: 'Good' }],
    images: ['https://example.com/img.jpg'],
    description: 'Project description',
    architecture: [],
    key_features: [{ title: 'Feature 1', desc: ['Desc 1'] }],
    troubleshooting: [],
    retrospective: 'Good project',
    priority: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  // 클라이언트에서 Form에 입력하는 신규 프로젝트 데이터
  const validInsertProject: InsertProjectDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Project',
    subtitle: 'A simple test project',
    status: 'IN_PROGRESS',
    started_at: '2026-01-01',
    ended_at: null,
    role: 'Frontend Developer',
    links: [{ label: 'Github', url: 'https://github.com' }],
    thumbnail_url: 'https://example.com/thumb.jpg',
    tech_stacks: [{ name: 'React', reason: 'Good' }],
    images: ['https://example.com/img.jpg'],
    description: 'Project description',
    architecture: [],
    key_features: [{ title: 'Feature 1', desc: ['Desc 1'] }],
    troubleshooting: [],
    retrospective: 'Good project',
    priority: 1,
  };

  describe('getProjectsList', () => {
    it('프로젝트 리스트를 성공적으로 조회해야 한다 (선택된 필드만)', async () => {
      const mockList = [validProject];
      mockOrder.mockResolvedValue({ data: mockList, error: null });

      const result = await getProjectsList();

      expect(result).toEqual({ success: true, data: mockList });
      expect(mockSelect).toHaveBeenCalledWith(
        'id, title, subtitle, status, started_at, ended_at, role, links, tech_stacks, thumbnail_url, priority',
      );
      expect(mockOrder).toHaveBeenCalledWith('priority', { ascending: false });
    });

    it('리스트 조회 중 에러 발생 시 예외를 던져야 한다', async () => {
      mockOrder.mockResolvedValue({ data: null, error: { message: 'DB 조회 에러' } });

      const result = await getProjectsList();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 조회 에러');
      }
    });
  });

  describe('getProjectById', () => {
    it('특정 ID의 프로젝트를 성공적으로 조회해야 한다', async () => {
      mockSingle.mockResolvedValue({ data: validProject, error: null });

      const result = await getProjectById(validProject.id);

      expect(result).toEqual({ success: true, data: validProject });
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', validProject.id);
      expect(mockSingle).toHaveBeenCalled();
    });

    it('단일 조회 중 에러 발생 시 예외를 던져야 한다', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'DB 조회 에러' } });

      const result = await getProjectById(validProject.id);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 조회 에러');
      }
    });
  });

  describe('createProject', () => {
    it('유효한 데이터로 프로젝트 생성에 성공해야 한다', async () => {
      mockSingle.mockResolvedValue({ data: validProject, error: null });

      const result = await createProject(validInsertProject);

      // insert 데이터를 통해 생성해서 validProject가 반환되어야 한다
      expect(result.success).toBe(true);
      expect(mockInsert).toHaveBeenCalledWith(validInsertProject);
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockSingle).toHaveBeenCalled();
    });

    it('프로젝트 생성 중 에러 발생 시 예외를 던져야 한다', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'DB 생성 에러' } });

      const result = await createProject(validInsertProject);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 생성 에러');
      }
    });
  });

  describe('updateProject', () => {
    it('유효한 데이터로 프로젝트 수정에 성공해야 한다', async () => {
      const updateData: UpdateProjectDto = { title: 'Updated Title' };
      const updatedProject = { ...validProject, title: 'Updated Title' };

      // update().eq().select().single()
      mockUpdate.mockImplementation(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: updatedProject, error: null }),
          })),
        })),
      }));

      const result = await updateProject(validProject.id, updateData);

      expect(result.success).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(updateData);
    });

    it('프로젝트 수정 중 에러 발생 시 예외를 던져야 한다', async () => {
      mockUpdate.mockImplementation(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB 수정 에러' } }),
          })),
        })),
      }));

      const result = await updateProject(validProject.id, { title: 'Updated' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 수정 에러');
      }
    });
  });

  describe('deleteProject', () => {
    it('특정 ID의 프로젝트 삭제에 성공해야 한다', async () => {
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteProject(validProject.id);

      await expect(result.success).toBe(true);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', validProject.id);
    });

    it('프로젝트 삭제 중 에러 발생 시 예외를 던져야 한다', async () => {
      mockEq.mockResolvedValue({ error: { message: 'DB 삭제 에러' } });

      const result = await deleteProject(validProject.id);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 삭제 에러');
      }
    });
  });
});

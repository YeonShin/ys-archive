import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InsertTechStackDto, UpdateTechStackDto } from '../../types';
import {
  createTechStack,
  deleteTechStack,
  getTechStacks,
  updateTechStack,
} from '../techStacks.service';

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
};

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => mockSupabase),
}));

describe('TechStacks Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTechStacks', () => {
    it('기술 스택 목록을 성공적으로 조회하고 type 기준으로 오름차순 정렬해야 한다', async () => {
      const mockData = [
        { id: '1', name: 'React', type: 'FRONTEND' },
        { id: '2', name: 'Node.js', type: 'BACKEND' },
      ];
      mockSupabase.order.mockResolvedValueOnce({ data: mockData, error: null });

      const result = await getTechStacks();

      expect(mockSupabase.from).toHaveBeenCalledWith('tech_stacks');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.order).toHaveBeenCalledWith('type', { ascending: true });
      expect(result).toEqual({ success: true, data: mockData });
    });

    it('목록 조회 중 에러 발생 시 실패 결과를 반환해야 한다', async () => {
      mockSupabase.order.mockResolvedValueOnce({ data: null, error: { message: 'DB 조회 에러' } });

      const result = await getTechStacks();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 조회 에러');
      }
    });
  });

  describe('createTechStack', () => {
    it('유효한 데이터로 기술 스택 생성에 성공해야 한다', async () => {
      const payload: InsertTechStackDto = {
        name: 'React',
        icon: 'react',
        type: 'FRONTEND',
        level: 'ADVANCED',
        color: '#61DAFB',
      };
      const mockReturn = { id: '1', ...payload };
      mockSupabase.single.mockResolvedValueOnce({ data: mockReturn, error: null });

      const result = await createTechStack(payload);

      expect(mockSupabase.from).toHaveBeenCalledWith('tech_stacks');
      expect(mockSupabase.insert).toHaveBeenCalledWith(payload);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockReturn });
    });

    it('기술 스택 생성 중 에러 발생 시 실패 결과를 반환해야 한다', async () => {
      const payload: InsertTechStackDto = {
        name: 'React',
        icon: 'react',
        type: 'FRONTEND',
        level: 'ADVANCED',
        color: '#61DAFB',
      };
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'DB 생성 에러' } });

      const result = await createTechStack(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 생성 에러');
      }
    });
  });

  describe('updateTechStack', () => {
    it('유효한 데이터로 기술 스택 수정에 성공해야 한다', async () => {
      const id = '1';
      const payload: UpdateTechStackDto = { level: 'EXPERT' };
      const mockReturn = { id, name: 'React', type: 'FRONTEND', level: 'EXPERT' };
      mockSupabase.single.mockResolvedValueOnce({ data: mockReturn, error: null });

      const result = await updateTechStack(id, payload);

      expect(mockSupabase.from).toHaveBeenCalledWith('tech_stacks');
      expect(mockSupabase.update).toHaveBeenCalledWith(payload);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', id);
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockReturn });
    });

    it('기술 스택 수정 중 에러 발생 시 실패 결과를 반환해야 한다', async () => {
      const id = '1';
      const payload: UpdateTechStackDto = { level: 'EXPERT' };
      mockSupabase.single.mockResolvedValueOnce({ data: null, error: { message: 'DB 수정 에러' } });

      const result = await updateTechStack(id, payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 수정 에러');
      }
    });
  });

  describe('deleteTechStack', () => {
    it('특정 ID의 기술 스택 삭제에 성공해야 한다', async () => {
      const id = '1';
      mockSupabase.eq.mockResolvedValueOnce({ error: null });

      const result = await deleteTechStack(id);

      expect(mockSupabase.from).toHaveBeenCalledWith('tech_stacks');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', id);
      expect(result).toEqual({ success: true });
    });

    it('기술 스택 삭제 중 에러 발생 시 실패 결과를 반환해야 한다', async () => {
      const id = '1';
      mockSupabase.eq.mockResolvedValueOnce({ error: { message: 'DB 삭제 에러' } });

      const result = await deleteTechStack(id);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 삭제 에러');
      }
    });
  });
});

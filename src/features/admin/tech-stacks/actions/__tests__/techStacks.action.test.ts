import { revalidatePath } from 'next/cache';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createTechStack,
  deleteTechStack,
  updateTechStack,
} from '../../services/techStacks.service';
import { InsertTechStackDto, UpdateTechStackDto } from '../../types';
import {
  createTechStackAction,
  deleteTechStackAction,
  updateTechStackAction,
} from '../techStacks.action';

vi.mock('../../services/techStacks.service', () => ({
  createTechStack: vi.fn(),
  updateTechStack: vi.fn(),
  deleteTechStack: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('TechStacks Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInsertData: InsertTechStackDto = {
    name: 'React',
    icon: 'react',
    type: 'FRONTEND',
    level: 'ADVANCED',
    color: '#61DAFB',
  };

  const validUpdateData: UpdateTechStackDto = {
    level: 'EXPERT',
  };

  describe('createTechStackAction', () => {
    it('기술 스택 생성 성공 시 revalidatePath를 호출하고 success:true를 반환해야 한다', async () => {
      vi.mocked(createTechStack).mockResolvedValue({
        success: true,
        data: { id: '1', ...validInsertData, created_at: '', updated_at: '' },
      });

      const result = await createTechStackAction(null, validInsertData);

      expect(result.success).toBe(true);
      expect(createTechStack).toHaveBeenCalledWith(validInsertData);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/tech-stacks');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('기술 스택 생성 실패 시 에러 결과를 반환해야 한다', async () => {
      vi.mocked(createTechStack).mockResolvedValue({ success: false, message: 'DB 에러' });

      const result = await createTechStackAction(null, validInsertData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 에러');
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe('updateTechStackAction', () => {
    it('기술 스택 수정 성공 시 revalidatePath를 호출하고 success:true를 반환해야 한다', async () => {
      vi.mocked(updateTechStack).mockResolvedValue({
        success: true,
        data: { id: '1', ...validInsertData, created_at: '', updated_at: '' },
      });

      const result = await updateTechStackAction(null, '1', validUpdateData);

      expect(result.success).toBe(true);
      expect(updateTechStack).toHaveBeenCalledWith('1', validUpdateData);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/tech-stacks');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('기술 스택 수정 실패 시 에러 결과를 반환해야 한다', async () => {
      vi.mocked(updateTechStack).mockResolvedValue({ success: false, message: '업데이트 실패' });

      const result = await updateTechStackAction(null, '1', validUpdateData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('업데이트 실패');
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe('deleteTechStackAction', () => {
    it('기술 스택 삭제 성공 시 revalidatePath를 호출하고 success:true를 반환해야 한다', async () => {
      vi.mocked(deleteTechStack).mockResolvedValue({ success: true });

      const result = await deleteTechStackAction(null, '1');

      expect(result.success).toBe(true);
      expect(deleteTechStack).toHaveBeenCalledWith('1');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/tech-stacks');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('기술 스택 삭제 실패 시 에러 결과를 반환해야 한다', async () => {
      vi.mocked(deleteTechStack).mockResolvedValue({ success: false, message: '삭제 실패' });

      const result = await deleteTechStackAction(null, '1');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('삭제 실패');
      }
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});

import { revalidatePath } from 'next/cache';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createExperience,
  deleteExperience,
  updateExperience,
} from '../../services/experiences.service';
import { ExperienceFormData } from '../../types';
import {
  createExperienceAction,
  deleteExperienceAction,
  updateExperienceAction,
} from '../experiences.action';

vi.mock('../../services/experiences.service', () => ({
  createExperience: vi.fn(),
  updateExperience: vi.fn(),
  deleteExperience: vi.fn(),
}));

// Next.js 라우팅/캐싱 함수 모킹
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Experience Action', () => {
  let mockFormData: FormData;
  const mockData: ExperienceFormData = {
    title: '소프트웨어 학사 졸업',
    organization: '충북대학교',
    started_at: '2020-03-01',
    ended_at: '2024-02-28',
    description: '설명',
    tech_stacks: [{ value: 'C' }, { value: 'Java' }], // 배열 안에 { value: string } 객체 형태
    details: [{ value: '알고리즘 동아리 회장' }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFormData = new FormData();
    mockFormData.append('data', JSON.stringify(mockData));
  });

  describe('createExperienceAction', () => {
    it('데이터가 정상적으로 파싱되고 DB Insert에 성공해야 한다', async () => {
      // 서비스 레이어 함수가 성공 응답을 반환하도록 모킹
      vi.mocked(createExperience).mockResolvedValue({ success: true, message: '생성 완료' });

      // Action 함수 실행 (첫 번째 인자는 useActionState의 이전 상태값)
      const result = await createExperienceAction(null, mockFormData);

      // 서비스 로직이 올바르게 파싱된 객체와 함께 호출되었는지 확인
      expect(createExperience).toHaveBeenCalledWith(mockData);

      // Next.js 캐시가 무효화되었는지 확인
      expect(revalidatePath).toHaveBeenCalledWith('/admin/experience');

      // 올바른 성공 반환값을 클라이언트에 반환하는지 확인
      expect(result).toEqual({ success: true, message: '생성 완료' });
    });

    it('필수 값이 누락된 경우 검증 에러를 반환해야 한다', async () => {
      // 필수 값인 title을 빈 값으로 변경하여 유효성 검사 실패 유도
      const invalidData = { ...mockData, title: '' };
      const invalidFormData = new FormData();
      invalidFormData.append('data', JSON.stringify(invalidData));

      const result = await createExperienceAction(null, invalidFormData);

      // 검증 실패로 인해 서비스 레이어(DB)가 호출되지 않아야 함
      expect(createExperience).not.toHaveBeenCalled();

      // 실패 상태 및 에러 객체를 반환해야 함
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined(); // 에러 객체가 존재해야 함
    });

    it('서비스 계층에서 에러가 발생한 경우 예외를 캐치하고 에러 메시지를 반환해야 한다', async () => {
      // 서비스 레이어에서 예기치 못한 에러 발생을 시뮬레이션
      vi.mocked(createExperience).mockRejectedValue(new Error('Database Error'));

      const result = await createExperienceAction(null, mockFormData);

      // 서비스 함수는 호출되었으나 실패함
      expect(createExperience).toHaveBeenCalled();

      // 서버가 터지지 않고 에러 메시지와 함께 실패 상태를 안전하게 반환함
      expect(result).toEqual({ success: false, message: 'Database Error' });
    });
  });

  describe('updateExperienceAction', () => {
    const mockId = '550e8400-e29b-41d4-a716-446655440000';

    it('유효한 데이터와 ID가 주어지면 DB Update에 성공해야 한다', async () => {
      vi.mocked(updateExperience).mockResolvedValue({ success: true, message: '수정 완료' });

      const formDataWithId = new FormData();
      formDataWithId.append('id', mockId.toString());
      formDataWithId.append('data', JSON.stringify(mockData));

      const result = await updateExperienceAction(null, formDataWithId);

      expect(updateExperience).toHaveBeenCalledWith(mockId, mockData);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/experience');
      expect(result).toEqual({ success: true, message: '수정 완료' });
    });

    it('필수 값이 누락된 경우 검증 에러를 반환해야 한다', async () => {
      const invalidData = { ...mockData, title: '' };
      const invalidFormData = new FormData();
      invalidFormData.append('id', mockId.toString());
      invalidFormData.append('data', JSON.stringify(invalidData));

      const result = await updateExperienceAction(null, invalidFormData);

      expect(updateExperience).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('존재하지 않는 ID 등 서비스 로직 에러 시 안전하게 에러 메시지를 반환해야 한다', async () => {
      vi.mocked(updateExperience).mockRejectedValue(new Error('Not Found'));

      const formDataWithId = new FormData();
      formDataWithId.append('id', mockId.toString());
      formDataWithId.append('data', JSON.stringify(mockData));

      const result = await updateExperienceAction(null, formDataWithId);

      expect(updateExperience).toHaveBeenCalled();
      expect(result).toEqual({ success: false, message: 'Not Found' });
    });
  });

  describe('deleteExperienceAction', () => {
    const mockId = '550e8400-e29b-41d4-a716-446655440000';

    it('유효한 ID가 주어지면 DB Delete에 성공해야 한다', async () => {
      vi.mocked(deleteExperience).mockResolvedValue({ success: true, message: '삭제 완료' });

      const formData = new FormData();
      formData.append('id', mockId.toString());

      const result = await deleteExperienceAction(null, formData);

      expect(deleteExperience).toHaveBeenCalledWith(mockId);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/experience');
      expect(result).toEqual({ success: true, message: '삭제 완료' });
    });

    it('ID가 누락되거나 유효하지 않은 숫자일 경우 에러를 반환해야 한다', async () => {
      const invalidFormData = new FormData();
      invalidFormData.append('id', 'invalid_id');

      const result = await deleteExperienceAction(null, invalidFormData);

      expect(deleteExperience).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.errors ?? result.message).toBeDefined(); // 에러 객체나 메시지가 반환되어야 함
    });

    it('삭제 중 에러 발생 시 예외를 캐치하고 에러 메시지를 반환해야 한다', async () => {
      vi.mocked(deleteExperience).mockRejectedValue(new Error('Delete Error'));

      const formData = new FormData();
      formData.append('id', mockId.toString());

      const result = await deleteExperienceAction(null, formData);

      expect(deleteExperience).toHaveBeenCalled();
      expect(result).toEqual({ success: false, message: 'Delete Error' });
    });
  });
});

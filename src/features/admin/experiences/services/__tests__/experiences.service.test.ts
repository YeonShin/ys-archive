import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExperienceFormData } from '../../types';
import {
  createExperience,
  deleteExperience,
  getExperiencesData,
  updateExperience,
} from '../experiences.service';

// 1. 공통으로 사용할 체이닝용 Mock 함수들
const mockEq = vi.fn();
const mockOrder = vi.fn();

// 2. 각 작업(select, insert, update, delete)에 대한 Mock 함수들
// select 후에는 order 체이닝이 가능하도록 객체를 반환합니다.
const mockExperiencesSelect = vi.fn(() => ({ order: mockOrder }));

// delete, insert, update 등은 eq 등으로 체이닝될 수 있습니다.
const mockDelete = vi.fn(() => ({ eq: mockEq }));
const mockInsert = vi.fn();
const mockUpdate = vi.fn(() => ({ eq: mockEq }));
const mockUpsert = vi.fn();

// 3. Supabase 클라이언트 전체 모킹
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'experiences') {
        return {
          select: mockExperiencesSelect,
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
          upsert: mockUpsert,
        };
      }
      return {};
    }),
  })),
}));

describe('Experiences Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validData: ExperienceFormData = {
    title: '소프트웨어 학사 졸업',
    organization: '충북대학교',
    started_at: '2020-03-01',
    ended_at: '2024-02-28',
    description: '설명',
    tech_stacks: [{ value: 'C' }, { value: 'Java' }], // 배열 안에 { value: string } 객체 형태
    details: [{ value: '알고리즘 동아리 회장' }],
  };

  describe('getExperiences', () => {
    it('experiences 조회를 성공해야 한다', async () => {
      mockOrder.mockResolvedValue({ data: [validData], error: null });
      const result = await getExperiencesData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([validData]);
      }
      expect(mockExperiencesSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalled();
    });

    it('experiences 조회 실패 시 에러를 반환해야 한다', async () => {
      // DB에서 에러가 발생한 상황을 연출 (data는 null, error는 객체)
      mockOrder.mockResolvedValue({ data: null, error: { message: 'DB 조회 에러' } });

      const result = await getExperiencesData();

      // 에러가 났으니 success는 false여야 하고, 에러 메시지가 잘 넘어와야 합니다.
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 조회 에러');
      }
    });
  });

  describe('createExperience', () => {
    it('유효한 데이터가 주어지면 새로운 experience 생성에 성공해야 한다', async () => {
      // DB에서 에러 없이 insert가 성공했다고 세팅합니다.
      mockInsert.mockResolvedValue({ error: null });

      const result = await createExperience(validData);

      expect(result.success).toBe(true);

      const expectedDbPayload = {
        title: validData.title,
        organization: validData.organization,
        started_at: validData.started_at,
        ended_at: validData.ended_at,
        description: validData.description,
        tech_stacks: ['C', 'Java'], // [{ value: 'C' }] 였던 객체 배열이 평범한 문자열 배열로 변환되어야 함
        details: ['알고리즘 동아리 회장'],
      };
      expect(mockInsert).toHaveBeenCalledWith(expectedDbPayload);
    });

    it('experience 생성 중 DB 에러가 발생하면 에러를 반환해야 한다', async () => {
      mockInsert.mockResolvedValue({ error: { message: 'DB 생성 에러' } });

      const result = await createExperience(validData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 생성 에러');
      }
    });
  });

  describe('updateExperience', () => {
    it('유효한 데이터와 id가 주어지면 experience 수정에 성공해야 한다', async () => {
      // update().eq() 형태이므로 마지막 체이닝인 mockEq에 결과를 세팅합니다.
      mockEq.mockResolvedValue({ error: null });

      // id가 1번인 데이터를 validData로 수정한다고 가정합니다.
      const result = await updateExperience('550e8400-e29b-41d4-a716-446655440000', validData);

      expect(result.success).toBe(true);

      const expectedDbPayload = {
        title: validData.title,
        organization: validData.organization,
        started_at: validData.started_at,
        ended_at: validData.ended_at,
        description: validData.description,
        tech_stacks: ['C', 'Java'],
        details: ['알고리즘 동아리 회장'],
      };
      // 올바른 데이터 형태로 update 함수가 불렸는지 검증
      expect(mockUpdate).toHaveBeenCalledWith(expectedDbPayload);
      // 어떤 데이터를 수정할지(id=1) eq 함수가 잘 불렸는지 검증
      expect(mockEq).toHaveBeenCalledWith('id', '550e8400-e29b-41d4-a716-446655440000');
    });

    it('experience 수정 중 DB 에러가 발생하면 에러를 반환해야 한다', async () => {
      mockEq.mockResolvedValue({ error: { message: 'DB 수정 에러' } });

      const result = await updateExperience('550e8400-e29b-41d4-a716-446655440000', validData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 수정 에러');
      }
    });
  });

  describe('deleteExperience', () => {
    it('id가 주어지면 experience 삭제에 성공해야 한다', async () => {
      mockEq.mockResolvedValue({ error: null });

      const result = await deleteExperience('550e8400-e29b-41d4-a716-446655440000');

      expect(result.success).toBe(true);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '550e8400-e29b-41d4-a716-446655440000');
    });

    it('experience 삭제 중 DB 에러가 발생하면 에러를 반환해야 한다', async () => {
      mockEq.mockResolvedValue({ error: { message: 'DB 삭제 에러' } });

      const result = await deleteExperience('550e8400-e29b-41d4-a716-446655440000');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.message).toBe('DB 삭제 에러');
      }
    });
  });
});

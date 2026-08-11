import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createExperienceAction,
  deleteExperienceAction,
  updateExperienceAction,
} from '../../actions/experiences.action';
import ExperienceManager from '../ExperienceManager';

// Server Actions 모킹
vi.mock('../../actions/experiences.action', () => ({
  createExperienceAction: vi.fn(),
  updateExperienceAction: vi.fn(),
  deleteExperienceAction: vi.fn(),
}));

describe('Experience UI 통합 테스트 (List, Form, Dialog)', () => {
  const mockInitialData = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: '소프트웨어 학사 졸업',
      organization: '충북대학교',
      startedAt: '2020-03-01',
      endedAt: '2024-02-28',
      description: '설명',
      techStacks: ['C', 'Java'],
      details: ['알고리즘 동아리 회장'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. 리스트 조회 (Read)', () => {
    it('DB상에 등록되어 있는 Experience 리스트(title, organization, 기간 등)가 화면에 올바르게 렌더링되어야 한다', () => {
      render(<ExperienceManager initialData={mockInitialData} />);

      // 화면에 초기 데이터 텍스트가 표시되어야 함
      expect(screen.getByText('소프트웨어 학사 졸업')).toBeInTheDocument();
      expect(screen.getByText('충북대학교')).toBeInTheDocument();
      expect(screen.getByText(/2020-03-01/)).toBeInTheDocument();
      expect(screen.getByText('설명')).toBeInTheDocument();
    });

    it('화면 어딘가에 "항목 추가" 버튼이 노출되며, 각 리스트 항목에는 "수정", "삭제" 버튼이 존재해야 한다', () => {
      render(<ExperienceManager initialData={mockInitialData} />);

      expect(screen.getByRole('button', { name: /항목 추가/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /수정/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /삭제/i })).toBeInTheDocument();
    });
  });

  describe('2. 항목 추가 폼 (Create)', () => {
    it('"항목 추가" 버튼을 누르면 새로운 데이터를 입력할 수 있는 폼이 화면에 나타나야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /항목 추가/i }));

      // 제목, 기관명 등의 input이 화면에 존재해야 함
      expect(screen.getByRole('textbox', { name: /제목/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /기관명/i })).toBeInTheDocument();
    });

    it('필수 입력값을 비우고 "저장" 버튼을 누를 경우, 각 필드 하단에 유효성 검증(Zod) 에러 메시지가 화면에 노출되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /항목 추가/i }));
      await user.click(screen.getByRole('button', { name: /저장/i }));

      expect(createExperienceAction).not.toHaveBeenCalled();

      // Zod 스키마에 정의된 에러 메시지들이 노출되는지 검증합니다.
      expect(await screen.findByText('역할/학위 이름을 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('소속 기관/학교를 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('시작일을 입력해주세요.')).toBeInTheDocument();
    });

    it('기술스택과 상세업무(details)의 "+" 버튼 클릭 시 각각의 입력폼이 동적으로 하나씩 늘어나야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /항목 추가/i }));

      const techStackAddBtn = screen.getByRole('button', { name: /기술스택 추가/i });
      await user.click(techStackAddBtn);

      // + 버튼 클릭 후 기술스택 관련 텍스트박스가 2개 이상이 되는지 확인
      const techStackInputs = screen.getAllByRole('textbox', { name: /기술스택/i });
      expect(techStackInputs.length).toBeGreaterThan(1);
    });

    it('"현재 진행중" 체크박스를 클릭하면 종료일(ended_at) 폼이 비활성화되며 null로 처리되도록 준비되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /항목 추가/i }));

      const isCurrentCheckbox = screen.getByRole('checkbox', { name: /현재 진행중/i });
      const endDateInput = screen.getByLabelText(/종료일/i);

      await user.click(isCurrentCheckbox);

      // 종료일 입력란이 disabled 처리되는지 검증
      expect(endDateInput).toBeDisabled();
    });

    it('폼에 유효한 데이터를 모두 입력하고 "저장" 버튼을 누르면 create 액션 함수가 올바르게 호출되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /항목 추가/i }));

      await user.type(screen.getByRole('textbox', { name: /제목/i }), '새로운 경력');
      await user.type(screen.getByRole('textbox', { name: /기관명/i }), '새로운 기관');
      await user.type(screen.getByLabelText(/시작일/i), '2023-01-01');
      await user.type(screen.getByRole('textbox', { name: /기술스택 0/i }), 'React');
      await user.type(screen.getByRole('textbox', { name: /상세업무 0/i }), 'UI 개발');

      vi.mocked(createExperienceAction).mockResolvedValue({ success: true, message: '생성 완료' });

      await user.click(screen.getByRole('button', { name: /저장/i }));

      await waitFor(() => {
        expect(createExperienceAction).toHaveBeenCalled();
      });
    });
  });

  describe('3. 항목 수정 폼 (Update)', () => {
    it('특정 항목의 "수정" 버튼을 누르면 기존 데이터가 바인딩된 수정 폼이 화면에 나타나야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /수정/i }));

      // 기존 제목이 폼에 채워져 있어야 함
      const titleInput = screen.getByRole('textbox', { name: /제목/i });
      expect(titleInput).toHaveValue('소프트웨어 학사 졸업');
    });

    it('데이터를 수정한 후 "저장(수정)" 버튼을 누르면 update 액션 함수가 호출되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /수정/i }));

      const titleInput = screen.getByRole('textbox', { name: /제목/i });
      await user.clear(titleInput);
      await user.type(titleInput, '수정된 학사 졸업');

      vi.mocked(updateExperienceAction).mockResolvedValue({ success: true, message: '수정 완료' });

      await user.click(screen.getByRole('button', { name: /저장/i }));

      await waitFor(() => {
        expect(updateExperienceAction).toHaveBeenCalled();
      });
    });
  });

  describe('4. 항목 삭제 (Delete)', () => {
    it('특정 항목의 "삭제" 버튼을 누르면 정말 삭제할지 묻는 확인 다이얼로그(Dialog)가 렌더링되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /삭제/i }));

      // 다이얼로그 문구 노출 확인
      expect(screen.getByText(/정말 삭제/i)).toBeInTheDocument();
    });

    it('다이얼로그에서 "확인" 버튼을 누르면 delete 액션 함수가 호출되어야 한다', async () => {
      const user = userEvent.setup();
      render(<ExperienceManager initialData={mockInitialData} />);

      await user.click(screen.getByRole('button', { name: /삭제/i }));

      vi.mocked(deleteExperienceAction).mockResolvedValue({ success: true, message: '삭제 완료' });

      // 다이얼로그 내의 확인 버튼 (모달 등에 있는 버튼)
      const confirmButton = screen.getByRole('button', { name: /확인/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(deleteExperienceAction).toHaveBeenCalled();
      });
    });
  });
});

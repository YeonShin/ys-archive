import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createTechStackAction,
  deleteTechStackAction,
  updateTechStackAction,
} from '../../actions/techStacks.action';
import TechStacksListClient from '../TechStacksListClient';

// Server Actions 모킹
vi.mock('../../actions/techStacks.action', () => ({
  createTechStackAction: vi.fn(),
  updateTechStackAction: vi.fn(),
  deleteTechStackAction: vi.fn(),
}));

// sonner toast 모킹
vi.mock('sonner', () => {
  const mockToast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });
  return { toast: mockToast };
});

const mockData = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'React',
    icon: 'react',
    type: 'FRONTEND',
    level: 'ADVANCED',
    color: '#61DAFB',
    created_at: '',
    updated_at: '',
  } as const,
];

describe('TechStacksListClient Integration', () => {
  beforeAll(() => {
    // window.confirm 모킹
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 데이터가 렌더링되어야 한다', () => {
    render(<TechStacksListClient initialData={mockData} />);
    // 텍스트 기반으로 렌더링 확인 (Role 대신 텍스트로 아이템 존재 여부 검증)
    expect(screen.getByRole('heading', { name: 'React' })).toBeInTheDocument();
  });

  it('Add 버튼 클릭 시 추가 폼 모달이 열려야 한다', () => {
    render(<TechStacksListClient initialData={mockData} />);
    const addButton = screen.getByRole('button', { name: /추가/i });

    fireEvent.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '기술 스택 추가' })).toBeInTheDocument();
  });

  it('Edit 버튼 클릭 시 수정 폼 모달이 열려야 한다', () => {
    render(<TechStacksListClient initialData={mockData} />);
    const editButton = screen.getByRole('button', { name: /수정/i });

    fireEvent.click(editButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '기술 스택 수정' })).toBeInTheDocument();
  });

  it('새로운 기술 스택 폼을 제출하면 createTechStackAction이 호출되어야 한다', async () => {
    vi.mocked(createTechStackAction).mockResolvedValue({ success: true });

    render(<TechStacksListClient initialData={mockData} />);

    // Add 폼 열기
    fireEvent.click(screen.getByRole('button', { name: /추가/i }));

    // 필수 필드 채우기 (Zod 검증 통과를 위함)
    fireEvent.change(screen.getByLabelText(/이름 \(Name\)/i), { target: { value: 'New Tech' } });
    fireEvent.change(screen.getByLabelText(/아이콘 식별자 \(Icon\)/i), {
      target: { value: 'newicon' },
    });
    fireEvent.change(screen.getByLabelText(/분류 \(Type\)/i), { target: { value: 'FRONTEND' } });

    // 폼 제출
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createTechStackAction).toHaveBeenCalled();
    });
  });

  it('기존 기술 스택 폼을 제출하면 updateTechStackAction이 호출되어야 한다', async () => {
    vi.mocked(updateTechStackAction).mockResolvedValue({ success: true });

    render(<TechStacksListClient initialData={mockData} />);

    // Edit 폼 열기
    fireEvent.click(screen.getByRole('button', { name: /수정/i }));

    // 폼에 데이터가 채워지기를 기다림
    await waitFor(() => {
      expect(screen.getByLabelText(/이름 \(Name\)/i)).toHaveValue('React');
    });

    // 폼 제출 (기존 데이터가 채워져 있으므로 바로 제출 가능)
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(updateTechStackAction).toHaveBeenCalled();
    });
  });

  it('Delete 버튼 클릭 시 toast가 호출되어야 한다', async () => {
    vi.mocked(deleteTechStackAction).mockResolvedValue({ success: true });

    render(<TechStacksListClient initialData={mockData} />);

    // Delete 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: /삭제/i }));

    await waitFor(() => {
      expect(deleteTechStackAction).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('성공적으로 삭제되었습니다.');
    });
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';

import { Project } from '../../types';
import ProjectForm from '../ProjectForm';

const mockInitialData: Project = {
  id: '123',
  title: '기존 프로젝트',
  subtitle: '기존 부제',
  status: 'LIVE',
  started_at: '2024-01-01',
  ended_at: '2024-12-31',
  role: '프론트엔드',
  links: [{ label: 'Github', url: 'https://github.com' }],
  thumbnail_url: 'https://example.com/thumb.png',
  tech_stacks: [{ name: 'React', reason: 'Good' }],
  images: ['https://example.com/screenshot1.png'],
  description: '기존 설명입니다.',
  architecture: [{ name: '아키텍처 1', url: 'https://example.com/arch.png', caption: '' }],
  key_features: [{ title: '로그인', desc: ['구글 로그인'] }],
  troubleshooting: [],
  retrospective: '좋았습니다.',
  priority: 1,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

// 모킹: Next.js 라우터 등 필요 시 여기에 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('ProjectForm 컴포넌트', () => {
  it('필수 값 누락 시 Zod 에러 메시지를 렌더링해야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    // 아무 값도 입력하지 않고 Submit 버튼 클릭
    const submitBtn = screen.getByRole('button', { name: /저장|제출/i });
    await user.click(submitBtn);

    // 에러 메시지가 화면에 출력되어야 한다
    await waitFor(() => {
      expect(screen.getByText('프로젝트명을 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('시작 날짜를 입력해주세요.')).toBeInTheDocument();
      expect(screen.getByText('담당 역할을 입력해주세요.')).toBeInTheDocument();
    });
  });

  it('tech_stacks 항목 추가 버튼 클릭 시 새로운 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addTechBtn = screen.getByRole('button', { name: /기술 스택 추가/i });
    await user.click(addTechBtn);

    // 필드가 추가되었는지 확인
    expect(screen.getByPlaceholderText(/예: React/i)).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 onCancel 콜백이 호출되어야 한다', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();
    render(<ProjectForm onCancel={handleCancel} />);

    const cancelBtn = screen.getByRole('button', { name: /취소/i });
    await user.click(cancelBtn);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('"현재 진행중" 체크박스를 클릭하면 종료 날짜 입력창이 비활성화되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const endedAtInput = screen.getByLabelText(/종료 날짜/i);
    const isCurrentCheckbox = screen.getByRole('checkbox', { name: /현재 진행중/i });

    // 초기 상태: 비활성화
    expect(endedAtInput).toBeDisabled();

    // 체크박스 클릭 -> 활성화 확인
    await user.click(isCurrentCheckbox);
    expect(endedAtInput).toBeEnabled();

    // 다시 클릭 -> 비활성화 확인
    await user.click(isCurrentCheckbox);
    expect(endedAtInput).toBeDisabled();
  });

  it('트러블슈팅 항목 추가 버튼 클릭 시 새로운 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addTroubleshootingBtn = screen.getByRole('button', { name: /\+ 트러블슈팅 추가/i });
    await user.click(addTroubleshootingBtn);

    expect(screen.getByPlaceholderText(/발생한 문제 상황/i)).toBeInTheDocument();
  });

  it('주요 기능(Key Feature) 항목 추가 버튼 클릭 시 새로운 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addFeatureBtn = screen.getByRole('button', { name: /\+ 기능 추가/i });
    await user.click(addFeatureBtn);

    expect(screen.getByPlaceholderText(/예: 소셜 로그인 연동/i)).toBeInTheDocument();
  });

  it('프로젝트 링크 추가 버튼 클릭 시 새로운 링크 입력 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addLinkBtn = screen.getByRole('button', { name: /\+ 링크 추가/i });
    await user.click(addLinkBtn);

    expect(screen.getByPlaceholderText(/ex\. Github, 웹 서비스, Notion/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/https:\/\/\.\.\./i)).toBeInTheDocument();
  });

  it('이미지 파일 첨부 시 URL.createObjectURL이 호출되어야 한다', async () => {
    const user = userEvent.setup();
    // 모킹: URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:http://localhost:3000/mock-url');

    render(<ProjectForm />);

    // 썸네일 파일 업로드 인풋을 찾기 위해 업로드 버튼을 클릭하면 input type=file이 동작함
    // 파일 인풋은 여러 개 있을 수 있으므로 testid나 querySelector를 활용
    const fileInputs = document.querySelectorAll(
      'input[type="file"]',
    ) as NodeListOf<HTMLInputElement>;
    const thumbnailInput = fileInputs[0];

    const file = new File(['mock-image-content'], 'thumbnail.png', { type: 'image/png' });
    await user.upload(thumbnailInput, file);

    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('수정 모드(initialData 제공)일 때 폼 필드들에 기존 값이 올바르게 세팅되어야 한다', () => {
    render(<ProjectForm initialData={mockInitialData} />);

    // 텍스트 필드 검증
    expect(screen.getByDisplayValue('기존 프로젝트')).toBeInTheDocument();
    expect(screen.getByDisplayValue('기존 부제')).toBeInTheDocument();
    expect(screen.getByDisplayValue('기존 설명입니다.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('프론트엔드')).toBeInTheDocument();

    // Tech stack 등 하위 배열 값 검증
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Good')).toBeInTheDocument();

    // 아키텍처 값 검증
    expect(screen.getByDisplayValue('아키텍처 1')).toBeInTheDocument();
  });

  it('아키텍처 항목 추가 버튼 클릭 시 새로운 아키텍처 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addArchitectureBtn = screen.getByRole('button', { name: /\+ 아키텍처 추가/i });
    await user.click(addArchitectureBtn);

    expect(screen.getByPlaceholderText(/예: 서비스 아키텍처/i)).toBeInTheDocument();
  });

  it('스크린샷 항목 추가 버튼 클릭 시 새로운 스크린샷 이미지 업로드 필드가 렌더링되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const addScreenshotBtn = screen.getByRole('button', { name: /\+ 스크린샷 추가/i });

    // 클릭 전 이미지 업로드 버튼 개수 확인 (기본적으로 썸네일용 1개가 있음)
    const initialUploadButtons = screen.getAllByRole('button', { name: /이미지 업로드/i });
    expect(initialUploadButtons).toHaveLength(1);

    // 스크린샷 추가
    await user.click(addScreenshotBtn);

    // 썸네일 1개 + 새로 추가된 스크린샷용 1개 = 2개여야 함
    const newUploadButtons = screen.getAllByRole('button', { name: /이미지 업로드/i });
    expect(newUploadButtons).toHaveLength(2);
  });

  it('10MB를 초과하는 이미지 파일 첨부 시 에러 토스트를 표시해야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectForm />);

    const fileInputs = document.querySelectorAll(
      'input[type="file"]',
    ) as NodeListOf<HTMLInputElement>;
    const thumbnailInput = fileInputs[0];

    // 11MB 크기의 가짜 파일 생성
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large-image.png', {
      type: 'image/png',
    });

    await user.upload(thumbnailInput, largeFile);

    expect(toast.error).toHaveBeenCalledWith('이미지 파일은 최대 10MB까지만 업로드할 수 있습니다.');
  });
});

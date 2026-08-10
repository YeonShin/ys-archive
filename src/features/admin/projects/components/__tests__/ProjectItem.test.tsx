import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Project } from '../../types';
import ProjectItem from '../ProjectItem';

const mockProjectDetail: Project = {
  id: '1',
  title: '프로젝트 A',
  subtitle: '부제 A',
  status: 'IN_PROGRESS',
  started_at: '2024-01-01',
  ended_at: null,
  role: 'Frontend',
  links: null,
  thumbnail_url: 'https://example.com/thumb.jpg',
  tech_stacks: [{ name: 'React', reason: '빠른 렌더링' }],
  images: [],
  description: '프로젝트 A의 상세 설명입니다.',
  architecture: [],
  key_features: [],
  troubleshooting: [],
  retrospective: '좋은 프로젝트였다.',
  priority: 1,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('../../actions/projects.action', () => ({
  deleteProjectAction: vi.fn(),
}));

vi.mock('../ProjectForm', () => ({
  default: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="mock-project-form">
      Mock Form
      <button onClick={onCancel}>취소</button>
    </div>
  ),
}));

describe('ProjectItem 컴포넌트', () => {
  it('프로젝트의 상세 정보가 화면에 렌더링되어야 한다', () => {
    render(<ProjectItem project={mockProjectDetail} />);

    expect(screen.getByText('프로젝트 A의 상세 설명입니다.')).toBeInTheDocument();
    expect(screen.getByText('좋은 프로젝트였다.')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 폼 뷰로 인라인 전환되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectItem project={mockProjectDetail} />);

    const editBtn = screen.getByRole('button', { name: /수정/i });
    await user.click(editBtn);

    expect(screen.getByTestId('mock-project-form')).toBeInTheDocument();
  });

  it('목록으로 돌아가기 버튼은 Link 컴포넌트여야 한다', () => {
    render(<ProjectItem project={mockProjectDetail} />);

    const backLink = screen.getByRole('link', { name: /목록으로/i });
    expect(backLink).toHaveAttribute('href', '/admin/projects');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProjectListItem } from '../../types';
import ProjectsListClient from '../ProjectsListClient';

const mockProjects: ProjectListItem[] = [
  {
    id: '1',
    title: '프로젝트 A',
    subtitle: '부제 A',
    status: 'IN_PROGRESS',
    started_at: '2024-01-01',
    ended_at: null,
    role: 'Frontend',
    links: null,
    tech_stacks: [],
    thumbnail_url: 'https://example.com/a.jpg',
    priority: 1,
  },
];

vi.mock('../ProjectForm', () => ({
  default: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="mock-project-form">
      Mock Form
      <button onClick={onCancel}>취소</button>
    </div>
  ),
}));

describe('ProjectsListClient 컴포넌트', () => {
  it('처음에는 프로젝트 목록을 렌더링해야 한다', () => {
    render(<ProjectsListClient initialProjects={mockProjects} />);
    expect(screen.getByText('Projects 관리')).toBeInTheDocument();
    expect(screen.getByText('프로젝트 A')).toBeInTheDocument();
  });

  it('새 프로젝트 버튼을 클릭하면 생성 폼 뷰로 전환되어야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectsListClient initialProjects={mockProjects} />);

    const newBtn = screen.getByRole('button', { name: /새 프로젝트/i });
    await user.click(newBtn);

    expect(screen.getByTestId('mock-project-form')).toBeInTheDocument();
    expect(screen.queryByText('Projects 관리')).not.toBeInTheDocument();
  });

  it('폼에서 취소 버튼을 누르면 다시 목록 뷰로 돌아와야 한다', async () => {
    const user = userEvent.setup();
    render(<ProjectsListClient initialProjects={mockProjects} />);

    // 폼 열기
    await user.click(screen.getByRole('button', { name: /새 프로젝트/i }));

    // 취소 버튼 누르기
    await user.click(screen.getByRole('button', { name: /취소/i }));

    expect(screen.queryByTestId('mock-project-form')).not.toBeInTheDocument();
    expect(screen.getByText('Projects 관리')).toBeInTheDocument();
  });
});

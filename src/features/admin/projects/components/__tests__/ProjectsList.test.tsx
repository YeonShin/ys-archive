import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProjectListItem } from '../../types';
import ProjectsList from '../ProjectsList';

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

describe('ProjectsList 컴포넌트', () => {
  it('프로젝트 목록이 정상적으로 렌더링되어야 한다', () => {
    render(<ProjectsList projects={mockProjects} />);

    expect(screen.getByText('프로젝트 A')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('프로젝트 항목이 올바른 Link를 렌더링해야 한다', () => {
    render(<ProjectsList projects={mockProjects} />);

    // href가 /admin/projects/1 인지 확인
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/admin/projects/1');
  });

  it('데이터가 없을 경우 안내 문구가 표시되어야 한다', () => {
    render(<ProjectsList projects={[]} />);
    expect(screen.getByText(/등록된 프로젝트가 없습니다/i)).toBeInTheDocument();
  });
});

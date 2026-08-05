import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DashboardStats from '../DashboardStats';

describe('DashboardStats Component', () => {
  it('통계 데이터가 정상적으로 전달되면 모든 항목이 렌더링되어야 한다', () => {
    const mockStats = {
      totalProjects: 10,
      totalTechStacks: 25,
      todayGuestbookCount: 3,
      totalVisitors: 1234,
      todayVisitors: 56,
    };

    render(<DashboardStats stats={mockStats} />);

    expect(screen.getByText('총 프로젝트')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('총 기술 스택')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText('오늘 방명록')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('총 방문자')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();

    expect(screen.getByText('오늘 방문자')).toBeInTheDocument();
    expect(screen.getByText('56')).toBeInTheDocument();
  });
});

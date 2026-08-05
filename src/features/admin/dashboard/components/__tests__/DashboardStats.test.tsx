import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DashboardStats from '../DashboardStats';

describe('DashboardStats Component', () => {
  it('통계 데이터가 정상적으로 전달되면 모든 항목이 렌더링되어야 한다', () => {
    const mockStats = {
      recentUpdateDate: '2026-08-05T00:00:00Z',
      todayGuestbookCount: 5,
      totalVisitors: 1500,
      todayVisitors: 150,
    };

    render(<DashboardStats stats={mockStats} />);

    expect(screen.getByText('최근 업데이트')).toBeInTheDocument();

    const d = new Date('2026-08-05T00:00:00Z');
    const pad = (n: number) => n.toString().padStart(2, '0');
    const expectedDate = `${d.getFullYear().toString().slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

    expect(screen.getByText(expectedDate)).toBeInTheDocument();

    expect(screen.getByText('오늘 방명록')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('총 방문자')).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument();

    expect(screen.getByText('오늘 방문자')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});

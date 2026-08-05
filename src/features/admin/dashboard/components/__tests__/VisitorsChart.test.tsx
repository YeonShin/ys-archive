import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import VisitorsChart from '../VisitorsChart';

// Recharts 컴포넌트들을 JSDOM 환경에서 테스트하기 위해 모킹합니다.
vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
    BarChart: ({ data }: { data: { date: string; count: number }[] }) => (
      <div data-testid="mock-barchart">
        {data.map((item, i) => (
          <span key={i}>{item.date}</span>
        ))}
      </div>
    ),
  };
});

describe('VisitorsChart Component', () => {
  it('데이터가 없을 때 "방문자 데이터가 없습니다." 메시지가 렌더링되어야 한다', () => {
    render(<VisitorsChart data={[]} />);

    expect(screen.getByText('최근 7일 방문자 추이')).toBeInTheDocument();
    expect(screen.getByText('방문자 데이터가 없습니다.')).toBeInTheDocument();
  });

  it('데이터가 주어지면 차트가 렌더링되고 데이터 라벨이 표시되어야 한다', () => {
    const mockData = [
      { date: '08/01', count: 10 },
      { date: '08/02', count: 20 },
    ];
    render(<VisitorsChart data={mockData} />);

    expect(screen.getByText('최근 7일 방문자 추이')).toBeInTheDocument();
    expect(screen.getByTestId('visitors-chart')).toBeInTheDocument();

    // XAxis 라벨 텍스트 확인
    expect(screen.getByText('08/01')).toBeInTheDocument();
    expect(screen.getByText('08/02')).toBeInTheDocument();
  });
});

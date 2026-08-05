import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import VisitorsChart from '../VisitorsChart';

describe('VisitorsChart Component', () => {
  it('방문자 추이 차트 타이틀과 플레이스홀더 데이터가 렌더링되어야 한다', () => {
    render(<VisitorsChart />);

    expect(screen.getByText('최근 7일 방문자 추이')).toBeInTheDocument();

    const chartContainer = screen.getByTestId('visitors-chart');
    expect(chartContainer).toBeInTheDocument();
  });
});

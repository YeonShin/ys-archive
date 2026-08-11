import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminSidebar from '../AdminSidebar';

// next/navigation 모킹
vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}));

describe('AdminSidebar Component', () => {
  it('관리자 사이드바에 필요한 모든 네비게이션 메뉴가 렌더링되어야 한다', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('프로필 관리')).toBeInTheDocument();
    expect(screen.getByText('경력/학력 관리')).toBeInTheDocument();
    expect(screen.getByText('프로젝트 관리')).toBeInTheDocument();
    expect(screen.getByText('방명록 관리')).toBeInTheDocument();
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logoutAdminAction } from '@/features/admin/auth/actions/auth.action';

import AdminHeader from '../AdminHeader';

// logout 액션 및 next/navigation 모킹
vi.mock('@/features/admin/auth/actions/auth.action', () => ({
  logoutAdminAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('AdminHeader Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('로그아웃 버튼 클릭 시 logoutAdminAction이 호출되고 성공 시 로그인 페이지로 이동해야 한다', async () => {
    vi.mocked(logoutAdminAction).mockResolvedValue({ success: true });
    render(<AdminHeader />);

    const logoutBtn = screen.getByText('로그아웃');
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(logoutAdminAction).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/admin/login');
    });
  });

  it('비밀번호 변경 버튼이 렌더링되어야 한다', () => {
    render(<AdminHeader />);
    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument();
  });
});

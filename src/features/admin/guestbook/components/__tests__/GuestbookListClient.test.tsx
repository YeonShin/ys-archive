import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteAdminGuestbookAction } from '../../actions/guestbook.action';
import GuestbookListClient from '../GuestbookListClient';

vi.mock('../../actions/guestbook.action', () => ({
  deleteAdminGuestbookAction: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/admin/guestbook'),
}));

vi.mock('sonner', () => {
  const mockToast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  });
  return { toast: mockToast };
});

const mockData = {
  data: [
    {
      id: '1',
      nickname: 'User1',
      content: 'This is a public post',
      isPublic: true,
      createdAt: '2026-08-11T00:00:00Z',
      updatedAt: '2026-08-11T00:00:00Z',
    },
    {
      id: '2',
      nickname: 'User2',
      content: 'This is a private post',
      isPublic: false,
      createdAt: '2026-08-10T00:00:00Z',
      updatedAt: '2026-08-10T00:00:00Z',
    },
  ],
  totalCount: 20,
  totalPages: 2,
  currentPage: 1,
};

describe('GuestbookListClient Integration', () => {
  beforeAll(() => {
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 데이터와 함께 리스트가 렌더링되어야 한다', () => {
    render(<GuestbookListClient initialResponse={mockData} />);

    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('This is a public post')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
    expect(screen.getByText('This is a private post')).toBeInTheDocument();
  });

  it('강제 삭제 버튼 클릭 시 confirm 승인 후 deleteAdminGuestbookAction이 호출되어야 한다', async () => {
    vi.mocked(deleteAdminGuestbookAction).mockResolvedValue({ success: true });

    render(<GuestbookListClient initialResponse={mockData} />);

    // 강제 삭제 버튼 클릭
    const deleteButtons = screen.getAllByRole('button', { name: /강제 삭제/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('정말로 이 방명록을 강제 삭제하시겠습니까?');
      expect(deleteAdminGuestbookAction).toHaveBeenCalledWith(null, '1');
      expect(toast.success).toHaveBeenCalledWith('방명록이 삭제되었습니다.');
    });
  });

  it('검색어를 입력하고 제출하면 useRouter.push가 호출되어 URL이 갱신되어야 한다', () => {
    render(<GuestbookListClient initialResponse={mockData} />);

    const searchInput = screen.getByPlaceholderText(/작성자명 또는 내용 검색/i);
    fireEvent.change(searchInput, { target: { value: 'User1' } });

    // 검색 버튼 클릭 혹은 Enter 입력 시뮬레이션
    const searchButton = screen.getByRole('button', { name: /검색/i });
    fireEvent.click(searchButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/guestbook?search=User1&page=1', {
      scroll: false,
    });
  });

  it('페이지네이션 버튼 클릭 시 해당 페이지로 라우팅되어야 한다', () => {
    render(<GuestbookListClient initialResponse={mockData} />);

    // 두 번째 페이지 버튼을 찾아 클릭
    const page2Button = screen.getByRole('button', { name: '페이지 2' });
    fireEvent.click(page2Button);

    expect(mockPush).toHaveBeenCalledWith('/admin/guestbook?page=2', { scroll: false });
  });
});

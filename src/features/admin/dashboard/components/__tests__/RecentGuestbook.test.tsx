import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RecentGuestbook from '../RecentGuestbook';

describe('RecentGuestbook Component', () => {
  it('최근 방명록 메시지가 전달되면 올바르게 렌더링되어야 한다', () => {
    const mockGuestbooks = [
      {
        id: '1',
        content: '포트폴리오 멋지네요!',
        nickname: '홍길동',
        createdAt: '2026-08-05T10:00:00Z',
        isPublic: true,
        updatedAt: '2026-08-05T10:00:00Z',
      },
      {
        id: '2',
        content: '잘 보고 갑니다.',
        nickname: '김철수',
        createdAt: '2026-08-05T09:00:00Z',
        isPublic: true,
        updatedAt: '2026-08-05T09:00:00Z',
      },
    ];

    render(<RecentGuestbook guestbooks={mockGuestbooks} />);

    expect(screen.getByText('최근 방명록')).toBeInTheDocument();

    expect(screen.getByText('포트폴리오 멋지네요!')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();

    expect(screen.getByText('잘 보고 갑니다.')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
  });

  it('방명록이 없을 경우 "최근 작성된 방명록이 없습니다." 메시지를 표시해야 한다', () => {
    render(<RecentGuestbook guestbooks={[]} />);

    expect(screen.getByText('최근 작성된 방명록이 없습니다.')).toBeInTheDocument();
  });
});

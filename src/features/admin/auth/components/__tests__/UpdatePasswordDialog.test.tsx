import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updatePasswordAction } from '../../actions/auth.action';
import UpdatePasswordDialog from '../UpdatePasswordDialog';

vi.mock('../../actions/auth.action', () => ({
  updatePasswordAction: vi.fn(),
}));

describe('UpdatePasswordDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('다이얼로그가 열리면 폼이 렌더링되어야 한다', () => {
    render(<UpdatePasswordDialog isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('비밀번호 변경')).toBeInTheDocument();
    expect(screen.getByLabelText(/새 비밀번호/i)).toBeInTheDocument();
  });

  it('비밀번호가 6자리 미만일 경우 유효성 검사 에러가 표시되어야 한다', async () => {
    render(<UpdatePasswordDialog isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText(/새 비밀번호/i);
    fireEvent.change(input, { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: '변경하기' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/최소 6자 이상이어야 합니다/)).toBeInTheDocument();
    });
    expect(updatePasswordAction).not.toHaveBeenCalled();
  });

  it('유효한 비밀번호를 입력하면 updatePasswordAction이 호출되고 닫혀야 한다', async () => {
    vi.mocked(updatePasswordAction).mockResolvedValue({ success: true });
    const onClose = vi.fn();

    render(<UpdatePasswordDialog isOpen={true} onClose={onClose} />);

    const input = screen.getByLabelText(/새 비밀번호/i);
    fireEvent.change(input, { target: { value: 'newPassword123!' } });

    const submitBtn = screen.getByRole('button', { name: '변경하기' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(updatePasswordAction).toHaveBeenCalledWith('newPassword123!');
      expect(onClose).toHaveBeenCalled();
    });
  });
});

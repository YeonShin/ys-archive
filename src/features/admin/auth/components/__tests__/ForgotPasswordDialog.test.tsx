import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { resetPasswordAction } from '../../actions/auth.action';
import ForgotPasswordDialog from '../ForgotPasswordDialog';

vi.mock('../../actions/auth.action', () => ({
  resetPasswordAction: vi.fn(),
}));

describe('ForgotPasswordDialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('다이얼로그가 열리면 이메일 입력 폼이 렌더링되어야 한다', () => {
    render(<ForgotPasswordDialog isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('비밀번호 찾기')).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
  });

  it('유효하지 않은 이메일을 입력할 경우 유효성 검사 에러가 표시되어야 한다', async () => {
    render(<ForgotPasswordDialog isOpen={true} onClose={vi.fn()} />);

    const input = screen.getByLabelText(/이메일/i);
    fireEvent.change(input, { target: { value: 'invalid-email' } });

    const submitBtn = screen.getByRole('button', { name: '이메일 발송' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/유효한 이메일 주소를 입력해주세요/)).toBeInTheDocument();
    });
    expect(resetPasswordAction).not.toHaveBeenCalled();
  });

  it('유효한 이메일을 입력하면 resetPasswordAction이 호출되고 닫혀야 한다', async () => {
    vi.mocked(resetPasswordAction).mockResolvedValue({ success: true });
    const onClose = vi.fn();

    render(<ForgotPasswordDialog isOpen={true} onClose={onClose} />);

    const input = screen.getByLabelText(/이메일/i);
    fireEvent.change(input, { target: { value: 'admin@example.com' } });

    const submitBtn = screen.getByRole('button', { name: '이메일 발송' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(resetPasswordAction).toHaveBeenCalledWith('admin@example.com');
      expect(onClose).toHaveBeenCalled();
    });
  });
});

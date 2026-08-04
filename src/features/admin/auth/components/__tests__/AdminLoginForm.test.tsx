import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as authActions from '../../actions/auth.action';
import AdminLoginForm from '../AdminLoginForm';

// 1. 서버 액션(loginAdminAction) 가짜 함수(Mock) 생성
vi.mock('../../actions/auth.action', () => ({
  loginAdminAction: vi.fn(),
}));

// 2. 알림 메시지용 Sonner Toast 모킹
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// 3. Next.js 라우터(네비게이션) 모킹
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('AdminLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 화면에 이메일, 비밀번호 입력 필드와 로그인 버튼이 렌더링되어야 한다', () => {
    render(<AdminLoginForm />);
    // placeholder 값으로 input 요소를 찾습니다.
    expect(screen.getByPlaceholderText(/admin@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    // 로그인 버튼이 정상적으로 표시되는지 확인
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
  });

  it('잘못된 이메일 형식 입력 시 Zod 유효성 에러 메시지를 표시해야 한다', async () => {
    const user = userEvent.setup();
    render(<AdminLoginForm />);

    const emailInput = screen.getByPlaceholderText(/admin@example.com/i);
    await user.type(emailInput, 'invalid-email-format'); // 올바르지 않은 이메일 입력

    const submitBtn = screen.getByRole('button', { name: /로그인/i });
    await user.click(submitBtn);

    // React Hook Form + Zod 검증이 작동하여 에러 문구가 뜨는지 확인
    expect(await screen.findByText(/유효한 이메일 주소를 입력해주세요/i)).toBeInTheDocument();
    // 서버 액션이 호출되지 않아야 함
    expect(authActions.loginAdminAction).not.toHaveBeenCalled();
  });

  it('비밀번호 누락 시 Zod 유효성 에러 메시지를 표시해야 한다', async () => {
    const user = userEvent.setup();
    render(<AdminLoginForm />);

    const emailInput = screen.getByPlaceholderText(/admin@example.com/i);
    await user.type(emailInput, 'admin@example.com');

    // 비밀번호는 의도적으로 비워두고 제출
    const submitBtn = screen.getByRole('button', { name: /로그인/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument();
    expect(authActions.loginAdminAction).not.toHaveBeenCalled();
  });

  it('로그인 진행 중에는 버튼이 비활성화(disabled) 상태가 되어야 한다', async () => {
    const user = userEvent.setup();

    // 서버 응답이 지연되는 상황(Pending)을 연출하기 위해 끝내지 않는 Promise 반환
    vi.mocked(authActions.loginAdminAction).mockImplementation(() => new Promise(() => {}));

    render(<AdminLoginForm />);

    await user.type(screen.getByPlaceholderText(/admin@example.com/i), 'admin@example.com');
    await user.type(screen.getByPlaceholderText(/••••••••/i), 'password123');

    const submitBtn = screen.getByRole('button', { name: /로그인/i });
    await user.click(submitBtn);

    // 버튼이 disabled 속성을 갖는지 비동기로 대기하며 확인
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it('서버 액션에서 실패(success: false)를 반환하면 에러 Toast를 띄워야 한다', async () => {
    const user = userEvent.setup();

    // 서버 액션이 에러를 반환하는 실패 케이스 모킹
    vi.mocked(authActions.loginAdminAction).mockResolvedValue({
      success: false,
      error: 'Invalid login credentials',
    });

    render(<AdminLoginForm />);

    await user.type(screen.getByPlaceholderText(/admin@example.com/i), 'admin@example.com');
    await user.type(screen.getByPlaceholderText(/••••••••/i), 'wrong-password');

    await user.click(screen.getByRole('button', { name: /로그인/i }));

    // 에러 텍스트를 Toast를 통해 호출했는지 검증
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid login credentials');
    });
  });
});

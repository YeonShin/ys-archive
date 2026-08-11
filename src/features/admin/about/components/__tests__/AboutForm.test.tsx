import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import { submitAboutFormAction } from '../../actions/about.action';
import { AboutFormData } from '../../types';
import AboutForm from '../AboutForm';

// submitAboutFormAction 모킹
vi.mock('../../actions/about.action', () => ({
  submitAboutFormAction: vi.fn(),
}));

const mockSubmitAboutFormAction = submitAboutFormAction as Mock;

describe('AboutForm', () => {
  const initialData: AboutFormData = {
    portfolioContent: {
      developer_role: 'Frontend Developer',
      hero_title: 'Welcome',
      hero_description: 'Hello World',
      profile_image_url: 'https://example.com/profile.jpg',
      about_text: 'About me text',
      resume_url: null,
    },
    contacts: [
      {
        id: '1',
        name: 'Email',
        icon: 'EmailIcon',
        url: 'mailto:test@test.com',
        description: 'Contact Email',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 데이터를 올바르게 렌더링해야 한다', () => {
    render(<AboutForm initialData={initialData} />);

    expect(screen.getByDisplayValue('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Welcome')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Hello World')).toBeInTheDocument();
    expect(screen.getByDisplayValue('About me text')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Email')).toBeInTheDocument();
    expect(screen.getByDisplayValue('mailto:test@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Contact Email')).toBeInTheDocument();
  });

  it('연락처 항목을 추가할 수 있어야 한다', async () => {
    render(<AboutForm initialData={initialData} />);

    const addButton = screen.getByText(/새 연락처 추가/i);
    fireEvent.click(addButton);

    // 추가된 폼 요소 확인 (비어있는 input들)
    const nameInputs = screen.getAllByLabelText(/연락처 이름/i);
    expect(nameInputs).toHaveLength(2); // 기존 1개 + 추가 1개
  });

  it('폼 제출 시 submitAboutFormAction이 호출되어야 한다', async () => {
    mockSubmitAboutFormAction.mockResolvedValueOnce({ success: true, data: initialData });

    render(<AboutForm initialData={initialData} />);

    // 폼을 수정하여 isDirty 상태를 true로 만듭니다.
    const roleInput = screen.getByLabelText(/개발자 직군/i);
    fireEvent.change(roleInput, { target: { value: 'Backend Developer' } });

    const submitButton = screen.getByRole('button', { name: /저장/i });

    // 버튼이 활성화될 때까지 대기
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitAboutFormAction).toHaveBeenCalledTimes(1);
    });
  });
});

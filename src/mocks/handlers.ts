import { HttpResponse, http } from 'msw';

export const handlers = [
  // 예시: 로그인 성공 모킹
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'mock-token',
      user: { id: 'test-user', email: 'test@example.com' },
    });
  }),
];

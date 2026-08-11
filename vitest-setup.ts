import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './src/mocks/server';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// 1. 모든 테스트 시작 전 MSW 서버 실행
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// 2. 각 테스트 종료 후 핸들러 초기화 (다른 테스트에 영향 방지)
afterEach(() => server.resetHandlers());

// 3. 모든 테스트 종료 후 MSW 서버 닫기
afterAll(() => server.close());

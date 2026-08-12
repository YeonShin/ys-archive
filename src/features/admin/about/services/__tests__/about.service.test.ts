import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AboutFormData } from '../../types';
import { getAboutData, updateAboutData } from '../about.service';

// Supabase mock
const mockPortfolioUpsert = vi.fn();
const mockDelete = vi.fn();
const mockUpsert = vi.fn();
const mockInsert = vi.fn();
const mockNot = vi.fn();
const mockSingle = vi.fn();
const mockLimit = vi.fn(() => ({ single: mockSingle }));
const mockOrder = vi.fn();
const mockPortfolioSelect = vi.fn(() => ({ limit: mockLimit }));
const mockContactSelect = vi.fn(() => ({ order: mockOrder }));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === 'portfolio_content') {
        return {
          upsert: mockPortfolioUpsert.mockResolvedValue({ error: null }),
          select: mockPortfolioSelect,
        };
      }
      if (table === 'contact') {
        return {
          delete: mockDelete.mockReturnValue({
            not: mockNot.mockResolvedValue({ error: null }),
            eq: mockNot.mockResolvedValue({ error: null }),
          }),
          upsert: mockUpsert.mockResolvedValue({ error: null }),
          insert: mockInsert.mockResolvedValue({ error: null }),
          select: mockContactSelect,
        };
      }
      return {};
    }),
  })),
}));

describe('About Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validData: AboutFormData = {
    portfolioContent: {
      developer_role: 'Frontend Developer',
      hero_title: 'Hello',
      hero_description: 'Desc',
      profile_image_url: 'http://example.com/img.jpg',
      about_text: 'About text',
      resume_url: null,
    },
    contacts: [
      {
        id: '1',
        name: 'Email',
        icon: 'EmailIcon',
        url: 'mailto:a@a.com',
        description: null,
      },
    ],
  };

  describe('getAboutData', () => {
    it('portfolio_content와 contact 조회를 성공해야 한다', async () => {
      mockSingle.mockResolvedValueOnce({ data: validData.portfolioContent, error: null });
      mockOrder.mockResolvedValueOnce({ data: validData.contacts, error: null });

      const result = await getAboutData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          portfolioContent: validData.portfolioContent,
          contacts: validData.contacts,
        });
      }
      expect(mockPortfolioSelect).toHaveBeenCalledWith('*');
      expect(mockContactSelect).toHaveBeenCalledWith('*');
    });

    it('portfolio_content 조회 실패 시 에러를 반환해야 한다', async () => {
      mockSingle.mockResolvedValueOnce({ error: { message: 'Fetch Error', code: '500' } });
      mockOrder.mockResolvedValueOnce({ data: validData.contacts, error: null });

      const result = await getAboutData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Fetch Error');
      }
    });

    it('portfolio_content가 비어있어도(PGRST116) 조회를 성공해야 한다', async () => {
      mockSingle.mockResolvedValueOnce({ error: { message: 'Not found', code: 'PGRST116' } });
      mockOrder.mockResolvedValueOnce({ data: validData.contacts, error: null });

      const result = await getAboutData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          portfolioContent: null,
          contacts: validData.contacts,
        });
      }
    });

    it('contact 조회 실패 시 에러를 반환해야 한다', async () => {
      mockSingle.mockResolvedValueOnce({ data: validData.portfolioContent, error: null });
      mockOrder.mockResolvedValueOnce({ error: { message: 'Contact Fetch Error' } });

      const result = await getAboutData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Contact Fetch Error');
      }
    });
  });

  it('유효한 데이터가 주어지면 portfolio_content와 contact 업데이트를 성공해야 한다', async () => {
    const result = await updateAboutData(validData);

    expect(result.success).toBe(true);
    // portfolio_content upsert 검증 (id 1 기준 upsert)
    expect(mockPortfolioUpsert).toHaveBeenCalledWith({ id: 1, ...validData.portfolioContent });

    // contact upsert 검증
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          name: 'Email',
        }),
      ]),
    );
  });

  it('portfolio_content 업데이트 실패 시 에러를 반환해야 한다', async () => {
    mockPortfolioUpsert.mockResolvedValueOnce({ error: { message: 'DB Error' } });

    const result = await updateAboutData(validData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('DB Error');
  });

  it('contact 삭제 실패 시 에러를 반환해야 한다', async () => {
    mockPortfolioUpsert.mockResolvedValueOnce({ error: null }); // portfolio success
    mockNot.mockResolvedValueOnce({ error: { message: 'Delete Error' } });

    const result = await updateAboutData(validData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Delete Error');
  });

  it('contact upsert 실패 시 에러를 반환해야 한다', async () => {
    mockPortfolioUpsert.mockResolvedValueOnce({ error: null }); // portfolio success
    mockNot.mockResolvedValueOnce({ error: null }); // delete success
    mockUpsert.mockResolvedValueOnce({ error: { message: 'Upsert Error' } });

    const result = await updateAboutData(validData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Upsert Error');
  });
});

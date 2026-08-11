import { createClient } from '@/lib/supabase/server';

export const fetchVercelVisitorStats = async (): Promise<{
  totalVisitors: number;
  todayVisitors: number;
}> => {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return { totalVisitors: 0, todayVisitors: 0 };
  }

  try {
    const url = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?projectId=${projectId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 300 }, // 5분 캐시
    });

    if (!response.ok) {
      console.warn(
        `[fetchVercelVisitorStats] API Error: ${response.status} ${response.statusText}`,
      );
      return { totalVisitors: 0, todayVisitors: 0 };
    }

    const json = await response.json();
    const visits = json?.data?.visits || 0;

    return {
      totalVisitors: visits,
      todayVisitors: visits, // Vercel API에서 기간별 필터링이 가능하면 추후 분리
    };
  } catch (error) {
    console.error(`[fetchVercelVisitorStats] Fetch failed:`, error);
    return { totalVisitors: 0, todayVisitors: 0 };
  }
};

export const getDashboardStats = async () => {
  try {
    const supabase = await createClient();

    // 1. 최근 업데이트 일자 조회
    const tables = ['portfolio_content', 'projects', 'tech_stacks', 'experiences'] as const;
    const queries = tables.map((table) =>
      supabase.from(table).select('updated_at').order('updated_at', { ascending: false }).limit(1),
    );

    const results = await Promise.all(queries);

    let recentUpdateDate: string | null = null;
    let maxDate = 0;

    results.forEach((result) => {
      if (result.error) throw result.error;
      const dateStr = result.data?.[0]?.updated_at;
      if (dateStr) {
        const time = new Date(dateStr).getTime();
        if (time > maxDate) {
          maxDate = time;
          recentUpdateDate = new Date(dateStr).toISOString();
        }
      }
    });

    // 2. 오늘 작성된 방명록 수 조회
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    kstDate.setUTCHours(0, 0, 0, 0);
    const todayStart = new Date(kstDate.getTime() - kstOffset).toISOString();

    const { count: todayGuestbookCount, error: guestbookError } = await supabase
      .from('guestbook')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart);

    if (guestbookError) throw guestbookError;

    // 3. Vercel 방문자 수 조회
    const visitorStats = await fetchVercelVisitorStats();

    return {
      success: true,
      data: {
        recentUpdateDate,
        todayGuestbookCount: todayGuestbookCount || 0,
        totalVisitors: visitorStats.totalVisitors,
        todayVisitors: visitorStats.todayVisitors,
      },
    };
  } catch (error) {
    console.error('[Dashboard.getDashboardStats] Failed to fetch dashboard stats:', error);
    const errorMessage =
      error instanceof Error ? error.message : '통계 데이터를 불러오는 중 오류가 발생했습니다.';
    return {
      success: false,
      error: errorMessage,
    };
  }
};
export const getRecentAdminGuestbooks = async (limit = 5) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('guestbook')
      .select('id, nickname, content, is_public, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      data: data.map((item) => ({
        id: item.id,
        nickname: item.nickname,
        content: item.content,
        isPublic: item.is_public,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })),
    };
  } catch (error) {
    console.error('[Dashboard.getRecentAdminGuestbooks] Failed to fetch guestbooks:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '방명록 데이터를 불러오지 못했습니다.',
    };
  }
};

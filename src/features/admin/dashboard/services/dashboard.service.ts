import { createClient } from '@/lib/supabase/server';

export const fetchVercelVisitorStats = async (): Promise<{
  totalVisitors: number;
  todayVisitors: number;
  chartData: { date: string; count: number }[];
}> => {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return { totalVisitors: 0, todayVisitors: 0, chartData: [] };
  }

  try {
    const now = new Date();
    // 1. 총 방문자 수 (최근 30일)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = tomorrow.toISOString(); // UTC 자정 내림 방지용

    // 2. 오늘 방문자 수 (KST 00:00 ~ 현재)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    kstNow.setUTCHours(0, 0, 0, 0);
    const todayStart = new Date(kstNow.getTime() - kstOffset).toISOString();
    const todayEnd = now.toISOString();

    // 3. 7일 방문자 차트 (KST 기준 최근 7일)
    const sevenDaysAgoKst = new Date(kstNow.getTime() - 6 * 24 * 60 * 60 * 1000);
    sevenDaysAgoKst.setUTCHours(0, 0, 0, 0);
    const sevenDaysAgoStart = new Date(sevenDaysAgoKst.getTime() - kstOffset).toISOString();

    const totalUrl = `https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=${projectId}&since=${thirtyDaysAgo}&until=${tomorrowEnd}`;
    const todayUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?projectId=${projectId}&by=hour&since=${todayStart}&until=${todayEnd}`;
    const chartUrl = `https://api.vercel.com/v1/query/web-analytics/visits/aggregate?projectId=${projectId}&by=hour&since=${sevenDaysAgoStart}&until=${todayEnd}`;

    const headers = { Authorization: `Bearer ${token}` };

    const [totalRes, todayRes, chartRes] = await Promise.all([
      fetch(totalUrl, { headers, next: { revalidate: 300 } }),
      fetch(todayUrl, { headers, next: { revalidate: 300 } }),
      fetch(chartUrl, { headers, next: { revalidate: 300 } }),
    ]);

    let totalVisits = 0;
    let todayVisits = 0;
    let chartData: { date: string; count: number }[] = [];

    if (totalRes.ok) {
      const totalJson = await totalRes.json();
      totalVisits = totalJson?.data?.visitors || 0;
    } else {
      console.warn(`[fetchVercelVisitorStats] Total API Error: ${totalRes.status}`);
    }

    if (todayRes.ok) {
      const todayJson = await todayRes.json();
      if (Array.isArray(todayJson?.data)) {
        todayVisits = todayJson.data.reduce(
          (sum: number, item: { visitors?: number }) => sum + (item.visitors || 0),
          0,
        );
      }
    } else {
      console.warn(`[fetchVercelVisitorStats] Today API Error: ${todayRes.status}`);
    }

    if (chartRes.ok) {
      const chartJson = await chartRes.json();
      if (Array.isArray(chartJson?.data)) {
        const aggregatedMap: Record<string, number> = {};

        // 7일치 날짜를 미리 0으로 초기화
        for (let i = 6; i >= 0; i--) {
          const d = new Date(kstNow.getTime() - i * 24 * 60 * 60 * 1000);
          const key = `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
          aggregatedMap[key] = 0;
        }

        // 시간별 데이터를 KST 날짜 기준으로 합산
        chartJson.data.forEach((item: { timestamp: string; visitors?: number }) => {
          const utcDate = new Date(item.timestamp);
          const kstDate = new Date(utcDate.getTime() + kstOffset);
          const key = `${String(kstDate.getUTCMonth() + 1).padStart(2, '0')}/${String(kstDate.getUTCDate()).padStart(2, '0')}`;

          if (aggregatedMap[key] !== undefined) {
            aggregatedMap[key] += item.visitors || 0;
          }
        });

        chartData = Object.keys(aggregatedMap).map((date) => ({
          date,
          count: aggregatedMap[date],
        }));
      }
    } else {
      console.warn(`[fetchVercelVisitorStats] Chart API Error: ${chartRes.status}`);
    }

    return {
      totalVisitors: totalVisits,
      todayVisitors: todayVisits,
      chartData,
    };
  } catch (error) {
    console.error(`[fetchVercelVisitorStats] Fetch failed:`, error);
    return { totalVisitors: 0, todayVisitors: 0, chartData: [] };
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
        chartData: visitorStats.chartData,
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

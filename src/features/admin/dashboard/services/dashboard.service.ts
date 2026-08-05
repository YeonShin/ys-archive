import { createClient } from '@/lib/supabase/server';

export const getDashboardStats = async () => {
  try {
    const supabase = await createClient();

    // 1. 총 프로젝트 수 조회
    const { count: totalProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (projectsError) throw projectsError;

    // 2. 총 기술 스택 수 조회
    const { count: totalTechStacks, error: techStacksError } = await supabase
      .from('tech_stacks')
      .select('*', { count: 'exact', head: true });

    if (techStacksError) throw techStacksError;

    // 3. 오늘 작성된 방명록 수 조회
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

    return {
      success: true,
      data: {
        totalProjects: totalProjects || 0,
        totalTechStacks: totalTechStacks || 0,
        todayGuestbookCount: todayGuestbookCount || 0,
        // TODO: 방문자 수 로직은 추후 Vercel Analytics 또는 별도의 로깅 테이블 연동 후 구현
        totalVisitors: 0,
        todayVisitors: 0,
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

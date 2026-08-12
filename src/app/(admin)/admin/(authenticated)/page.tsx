import DashboardStats from '@/features/admin/dashboard/components/DashboardStats';
import RecentGuestbook from '@/features/admin/dashboard/components/RecentGuestbook';
import VisitorsChart from '@/features/admin/dashboard/components/VisitorsChart';
import {
  getDashboardStats,
  getRecentAdminGuestbooks,
} from '@/features/admin/dashboard/services/dashboard.service';

const AdminDashboardPage = async () => {
  // 1. 대시보드 상단 통계 데이터 패치
  const statsResult = await getDashboardStats();
  const dashboardData = statsResult.data || {
    recentUpdateDate: null,
    todayGuestbookCount: 0,
    totalVisitors: 0,
    todayVisitors: 0,
  };

  // 2. 방문자 차트 데이터
  const visitorsChartData = statsResult.data?.chartData || [];

  // 3. 최근 방명록 데이터 패치
  const guestbookResult = await getRecentAdminGuestbooks(5);
  const recentGuestbooks = guestbookResult?.data || [];

  return (
    <div className="flex flex-col gap-8">
      {/* 상단 통계 카드 */}
      <section>
        <DashboardStats stats={dashboardData} />
      </section>

      {/* 차트 및 방명록 (2단 레이아웃) */}
      <section className="grid gap-8 lg:grid-cols-2">
        <VisitorsChart data={visitorsChartData} />
        <RecentGuestbook guestbooks={recentGuestbooks} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;

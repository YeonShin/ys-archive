import DashboardStats from '@/features/admin/dashboard/components/DashboardStats';
import VisitorsChart from '@/features/admin/dashboard/components/VisitorsChart';
import { getDashboardStats } from '@/features/admin/dashboard/services/dashboard.service';

const AdminDashboardPage = async () => {
  // 1. 대시보드 상단 통계 데이터 패치
  const statsResult = await getDashboardStats();
  const dashboardData = statsResult.data || {
    recentUpdateDate: null,
    todayGuestbookCount: 0,
    totalVisitors: 0,
    todayVisitors: 0,
  };

  // 2. 방문자 차트 더미 데이터 (추후 Vercel Analytics 연동 시 실제 데이터로 교체)
  const visitorsChartData = [
    { date: '08/01', count: 120 },
    { date: '08/02', count: 145 },
    { date: '08/03', count: 110 },
    { date: '08/04', count: 205 },
    { date: '08/05', count: 180 },
    { date: '08/06', count: 250 },
    { date: '08/07', count: 190 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 상단 통계 카드 */}
      <section>
        <DashboardStats stats={dashboardData} />
      </section>

      {/* 차트 및 방명록 (2단 레이아웃) */}
      <section className="grid gap-8 lg:grid-cols-2">
        <VisitorsChart data={visitorsChartData} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;

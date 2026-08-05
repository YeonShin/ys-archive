import DashboardStats from '@/features/admin/dashboard/components/DashboardStats';
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

  return (
    <div className="flex flex-col gap-8">
      {/* 상단 통계 카드 */}
      <section>
        <DashboardStats stats={dashboardData} />
      </section>
    </div>
  );
};

export default AdminDashboardPage;

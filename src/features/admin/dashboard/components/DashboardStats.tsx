import { BookOpen, Calendar, Users } from 'lucide-react';

interface DashboardStatsProps {
  recentUpdateDate: string | null;
  todayGuestbookCount: number;
  totalVisitors: number;
  todayVisitors: number;
}

const DashboardStats = ({ stats }: { stats: DashboardStatsProps }) => {
  const formattedDate = stats.recentUpdateDate
    ? (() => {
        const d = new Date(stats.recentUpdateDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear().toString().slice(2)}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      })()
    : '없음';

  const statItems = [
    { title: '총 방문자', value: stats.totalVisitors, icon: Users },
    { title: '오늘 방문자', value: stats.todayVisitors, icon: Users },
    { title: '오늘 방명록', value: stats.todayGuestbookCount, icon: BookOpen },
    { title: '최근 업데이트', value: formattedDate, icon: Calendar },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-admin-card border-admin-border flex flex-col rounded-xl border p-6 shadow-sm"
        >
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-admin-muted text-sm font-medium tracking-tight">{item.title}</h3>
            <item.icon className="text-admin-muted h-4 w-4" />
          </div>
          <div>
            <div
              className={`text-admin-text truncate font-bold ${typeof item.value === 'string' ? 'text-xl' : 'text-2xl'}`}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface VisitorsChartProps {
  data?: { date: string; count: number }[];
}

const VisitorsChart = ({ data = [] }: VisitorsChartProps) => {
  return (
    <div className="bg-admin-card border-admin-border flex h-[400px] flex-col rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between space-y-1.5 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h3 className="text-admin-text text-lg font-semibold tracking-tight">
            최근 7일 방문자 추이
          </h3>
        </div>
      </div>

      {data.length === 0 ? (
        <div
          data-testid="visitors-chart"
          className="text-admin-muted flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
        >
          방문자 데이터가 없습니다.
        </div>
      ) : (
        <div data-testid="visitors-chart" className="min-h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
                className="dark:stroke-gray-800"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'var(--admin-border, #e5e7eb)', opacity: 0.4, radius: 8 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-admin-card border-admin-border rounded-lg border p-3 shadow-md">
                        <p className="text-admin-muted mb-1 text-sm font-medium">{label}</p>
                        <p className="text-admin-text text-sm font-bold">{payload[0].value}명</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VisitorsChart;

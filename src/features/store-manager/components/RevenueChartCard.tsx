import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { revenueSeries } from '@/features/store-manager/data/storeManagerDashboard';

export function RevenueChartCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Weekly Revenue Pulse</CardTitle>
        <CardDescription>
          Orders and revenue trends for the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueSeries}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                'Revenue',
              ]}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-2)"
              strokeWidth={3}
              dot={{ r: 3, stroke: 'var(--chart-2)', fill: 'var(--card)' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

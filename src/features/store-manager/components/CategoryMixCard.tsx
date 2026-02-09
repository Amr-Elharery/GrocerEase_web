import {
  Bar,
  BarChart,
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
import { categoryShare } from '@/features/store-manager/data/storeManagerDashboard';

export function CategoryMixCard() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Top Category Mix</CardTitle>
        <CardDescription>Share of total weekly orders.</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={categoryShare}
            layout="vertical"
            margin={{ left: 16, right: 16 }}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              width={80}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Share']}
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
              }}
            />
            <Bar dataKey="share" fill="var(--chart-4)" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

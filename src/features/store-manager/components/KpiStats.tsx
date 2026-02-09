import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { kpiStats } from '@/features/store-manager/data/storeManagerDashboard';

export function KpiStats() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiStats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardDescription>{stat.label}</CardDescription>
            <CardTitle className="text-2xl">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
            <Badge variant="secondary">{stat.delta}</Badge>
            <span>{stat.note}</span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

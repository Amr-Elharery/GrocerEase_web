import { CategoryMixCard } from './CategoryMixCard';
import { DashboardHeader } from './DashboardHeader';
import { KpiStats } from './KpiStats';
import { OrdersTableCard } from './OrdersTableCard';
import { RevenueChartCard } from './RevenueChartCard';
import { StoreManagerSidebar } from './StoreManagerSidebar';

export function StoreManagerDashboard() {
  return (
    <div className="bg-background text-foreground">
      <div className="flex flex-col lg:flex-row">
        <StoreManagerSidebar />
        <main className="flex-1">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
            <DashboardHeader />
            <KpiStats />
            <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
              <RevenueChartCard />
              <CategoryMixCard />
            </section>
            <section>
              <OrdersTableCard />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

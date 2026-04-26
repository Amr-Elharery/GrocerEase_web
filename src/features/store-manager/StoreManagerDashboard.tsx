import { CategoryMixCard } from './components/CategoryMixCard';
import { DashboardHeader } from './components/DashboardHeader';
import { KpiStats } from './components/KpiStats';
import { OrdersTableCard } from './components/OrdersTableCard';
import { RevenueChartCard } from './components/RevenueChartCard';
import { StoreManagerSidebar } from './components/StoreManagerSidebar';

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

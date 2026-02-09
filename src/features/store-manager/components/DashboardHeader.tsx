import { storeInfo } from '@/features/store-manager/data/storeManagerDashboard';

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-5">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Store Manager
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            ZAD Operations Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
            {storeInfo.name}
          </span>
          <span>{storeInfo.location}</span>
          <span className="text-xs">Manager: {storeInfo.manager}</span>
          <span className="text-xs">Updated {storeInfo.updatedAt}</span>
        </div>
      </div>
    </header>
  );
}

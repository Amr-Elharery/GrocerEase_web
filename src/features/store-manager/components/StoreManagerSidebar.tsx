import { ThemeSwitcher } from '@/components/domain/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import {
  storeInfo,
  storeNav,
} from '@/features/store-manager/data/storeManagerDashboard';

export function StoreManagerSidebar() {
  return (
    <aside className="flex w-full flex-col gap-6 border-border/70 bg-background px-6 py-6 lg:w-64 lg:border-r">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Store
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          {storeInfo.name}
        </h2>
        <p className="text-xs text-muted-foreground">{storeInfo.location}</p>
      </div>
      <nav className="flex flex-col gap-3">
        {storeNav.map((item) => (
          <button
            key={item.label}
            type="button"
            className="rounded-md border border-border/70 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
          >
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="block text-xs text-muted-foreground">
              {item.description}
            </span>
          </button>
        ))}
      </nav>
      <ThemeSwitcher />
    </aside>
  );
}

import { Route, Routes } from 'react-router';

import { StoreManagerDashboard } from '@/features/store-manager/components/StoreManagerDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StoreManagerDashboard />} />
      <Route
        path="*"
        element={
          <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
            Page not found
          </div>
        }
      />
    </Routes>
  );
}

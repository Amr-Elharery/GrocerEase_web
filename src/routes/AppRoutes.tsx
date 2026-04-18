import { Route, Routes } from 'react-router';

import { ThemeSwitcher } from '@/components/domain/ThemeSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StarterPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl items-center justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GrocerEase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Project reset complete. Start building your app from here.
          </p>
          <ThemeSwitcher />
        </CardContent>
      </Card>
    </main>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StarterPage />} />
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

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/theme-provider";
import { AppRoutes } from "@/routes/AppRoutes";
import { SearchProvider } from "@/Context/SearchContext";
import { AuthProvider } from "@/Context/AuthContext";
import { DirectionProvider } from "@/components/domain/DirectionProvider";
import "@/lib/i18n";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="zad-ui-theme">
          <DirectionProvider>
            <AuthProvider>
              <SearchProvider>
                <AppRoutes />
              </SearchProvider>
            </AuthProvider>
          </DirectionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>,
);
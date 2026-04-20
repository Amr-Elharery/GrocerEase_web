import { Navigate } from "react-router";
import { authService } from "@/features/auth/api/authService";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
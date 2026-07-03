import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../api/analyticsService";

export function useShopDashboard() {
  return useQuery({
    queryKey: ["shop-dashboard"],
    queryFn: () => analyticsService.getShopDashboard(),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => analyticsService.getAdminDashboard(),
  });
}
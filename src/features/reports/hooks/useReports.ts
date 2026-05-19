import { useQuery } from '@tanstack/react-query';
import { reportService } from '../api/reportService';

export function useReportSummary() {
  return useQuery({
    queryKey: ['report-summary'],
    queryFn: () => reportService.getSummary(),
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['report-revenue'],
    queryFn: () => reportService.getRevenueData(),
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['report-top-products'],
    queryFn: () => reportService.getTopProducts(),
  });
}

export function useStorePerformance() {
  return useQuery({
    queryKey: ['report-store-performance'],
    queryFn: () => reportService.getStorePerformance(),
  });
}

export function useOrderStatus() {
  return useQuery({
    queryKey: ['report-order-status'],
    queryFn: () => reportService.getOrderStatus(),
  });
}
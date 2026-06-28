import { useQuery } from '@tanstack/react-query';
import { orderService } from '../api/orderService';

export function useOrders(page: number = 1) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => orderService.getOrders(page),
    placeholderData: (prev) => prev,
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId!),
    enabled: orderId !== undefined,
  });
}
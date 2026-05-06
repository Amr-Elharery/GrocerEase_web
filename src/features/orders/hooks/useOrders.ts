import { useQuery } from '@tanstack/react-query';
import { orderService } from '../api/orderService';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../api/orderService';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
  });
}

export function useDeliveryPersonnel() {
  return useQuery({
    queryKey: ['delivery-personnel'],
    queryFn: () => orderService.getDeliveryPersonnel(),
  });
}

export function useAssignOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, deliveryPersonnelId }: { orderId: string; deliveryPersonnelId: string }) =>
      orderService.assignOrder(orderId, deliveryPersonnelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
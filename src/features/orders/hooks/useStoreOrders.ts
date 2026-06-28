import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeOrderService, type StoreOrder } from '../api/storeOrderService';

const SHOP_ID = "shop-1";

export function useStoreOrders(page: number = 1) {
  return useQuery({
    queryKey: ['store-orders', page],
    queryFn: () => storeOrderService.getOrders(page),
    refetchInterval: 30000, // auto-refresh every 30s
    placeholderData: (prev) => prev,
  });
}

export function useStoreOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ['store-order', orderId],
    queryFn: () => storeOrderService.getOrder(orderId!),
    enabled: orderId !== undefined,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: StoreOrder["status"] }) =>
      storeOrderService.updateOrderStatus(SHOP_ID, orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['store-orders'] });
    },
  });
}
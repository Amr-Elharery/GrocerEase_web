import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeOrderService, type StoreOrder } from '../api/storeOrderService';

const SHOP_ID = "shop-1";

export function useStoreOrders() {
  return useQuery({
    queryKey: ['store-orders', SHOP_ID],
    queryFn: () => storeOrderService.getOrders(SHOP_ID),
    refetchInterval: 30000, // auto-refresh every 30s
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: StoreOrder["status"] }) =>
      storeOrderService.updateOrderStatus(SHOP_ID, orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['store-orders', SHOP_ID] });
    },
  });
}
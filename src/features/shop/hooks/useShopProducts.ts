import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopService } from '../api/shopService';

export function useShopProducts(shopId: string, page: number = 1, limit?: number) {
  return useQuery({
    queryKey: ['shop-products', shopId, page, limit],
    queryFn: () => shopService.getShopProducts(shopId, page, limit),
  });
}

export function useAvailableProducts(shopId: string, search: string = "", categoryId: string = "") {
  return useQuery({
    queryKey: ['available-products', shopId, search, categoryId],
    queryFn: () => shopService.getAvailableProducts(shopId, search, categoryId),
  });
}

export function useAddShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, payload }: {
      shopId: string;
      payload: { product_id: string; price: number; available_stock: number; low_stock_threshold: number };
    }) => shopService.addShopProduct(shopId, payload),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
      qc.invalidateQueries({ queryKey: ['available-products', shopId] });
    },
  });
}

export function useUpdateShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, productId, payload }: {
      shopId: string;
      productId: string;
      payload: { price?: number; available_stock?: number; low_stock_threshold?: number };
    }) => shopService.updateShopProduct(shopId, productId, payload),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });
}

export function useMarkAvailable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }: { shopId: string; productId: string }) =>
      shopService.markAvailable(productId),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });
}

export function useMarkUnavailable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }: { shopId: string; productId: string }) =>
      shopService.markUnavailable(productId),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });
}

export function useDeleteShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => shopService.deleteShopProduct(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });
}
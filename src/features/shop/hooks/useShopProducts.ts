import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopService } from '../api/shopService';

export function useShopProducts(shopId: string, page: number = 1) {
  return useQuery({
    queryKey: ['shop-products', shopId, page],
    queryFn: () => shopService.getShopProducts(shopId, page),
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
      payload: { price?: number; available_stock?: number };
    }) => shopService.updateShopProduct(shopId, productId, payload),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });
}

export function useToggleShopProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, productId, is_active }: {
      shopId: string;
      productId: string;
      is_active: boolean;
    }) => shopService.toggleShopProduct(shopId, productId, is_active),
    onSuccess: (_, { shopId }) => {
      qc.invalidateQueries({ queryKey: ['shop-products', shopId] });
    },
  });
}
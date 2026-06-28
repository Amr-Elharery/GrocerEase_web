import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shopApi, type CreateShopPayload, type ShopPayload } from "../api/shopApi";

export function useMyShop(enabled = true) {
  return useQuery({
    queryKey: ["my-shop"],
    queryFn: () => shopApi.getMyShop(),
    enabled,
    retry: false,
  });
}

export function useShops(params: { limit?: number; offset?: number; search?: string; area_id?: number } = {}) {
  return useQuery({
    queryKey: ["shops", params],
    queryFn: () => shopApi.getAllShops(params),
  });
}

export function useShop(shopId: number | undefined) {
  return useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => shopApi.getShop(shopId!),
    enabled: shopId !== undefined,
  });
}

export function useCreateShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShopPayload) => shopApi.createShop(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-shop"] });
    },
  });
}

export function useUpdateShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ shopId, payload }: { shopId: number; payload: ShopPayload }) =>
      shopApi.updateShop(shopId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-shop"] });
      qc.invalidateQueries({ queryKey: ["shops"] });
    },
  });
}


export function useDeleteShop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (shopId: number) => shopApi.deleteShop(shopId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-shop"] });
      qc.invalidateQueries({ queryKey: ["shops"] });
    },
  });
}

export function useAreas() {
  return useQuery({
    queryKey: ["areas"],
    queryFn: () => shopApi.getAreas(),
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productRequestService, type CreateProductRequestPayload } from "../api/submissionRequestService";

export function useProductRequests(params: { status?: string; shop_id?: number } = {}) {
  return useQuery({
    queryKey: ["product-requests", params],
    queryFn: () => productRequestService.getAll(params),
  });
}

export function useMyRequests(shopId: number | undefined) {
  return useQuery({
    queryKey: ["my-requests", shopId],
    queryFn: () => productRequestService.getAll({ shop_id: shopId }),
    enabled: shopId !== undefined,
  });
}

export function useProductRequest(id: number | undefined) {
  return useQuery({
    queryKey: ["product-request", id],
    queryFn: () => productRequestService.getOne(id!),
    enabled: id !== undefined,
  });
}

export function useCreateProductRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductRequestPayload) => productRequestService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
  });
}

export function useApproveRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productRequestService.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product-requests"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useRejectRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productRequestService.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-requests"] }),
  });
}
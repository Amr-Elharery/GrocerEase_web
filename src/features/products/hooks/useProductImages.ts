import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useDeleteProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productService.deleteProductImage(productId, imageId),
    onSuccess: (_, { productId }) => {
      qc.invalidateQueries({ queryKey: ['product', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useMakePrimaryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: string; imageId: string }) =>
      productService.makePrimaryImage(productId, imageId),
    onSuccess: (_, { productId }) => {
      qc.invalidateQueries({ queryKey: ['product', productId] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
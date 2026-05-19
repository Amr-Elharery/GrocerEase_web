import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: unknown) => productService.createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
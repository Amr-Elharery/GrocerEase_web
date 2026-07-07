import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }: { data: unknown; files: File[] }) =>
      productService.createProduct(data, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
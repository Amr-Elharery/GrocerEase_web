import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, files }: { id: string; data: unknown; files: File[] }) =>
      productService.updateProduct(id, data, files),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['product', id] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useProducts(_page: number = 1) {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });
}
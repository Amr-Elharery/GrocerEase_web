import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';

export function useProducts(page: number = 1) {
  return useQuery({
    queryKey: ['products', page],
    queryFn: () => productService.getProducts(page),
  });
}
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';

const PAGE_SIZE = 10;

export function useProducts(page: number = 1, search: string = "", limit: number = PAGE_SIZE) {
  return useQuery({
    queryKey: ['products', page, search, limit],
    queryFn: () =>
      productService.getProducts({
        limit,
        offset: (page - 1) * limit,
        search,
      }),
    placeholderData: (prev) => prev,
  });
}

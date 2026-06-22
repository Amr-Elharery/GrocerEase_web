import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';

const PAGE_SIZE = 10;

export function useProducts(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: ['products', page, search],
    queryFn: () =>
      productService.getProducts({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search,
      }),
    placeholderData: (prev) => prev,
  });
}
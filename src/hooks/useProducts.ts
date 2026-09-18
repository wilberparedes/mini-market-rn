import { useInfiniteQuery } from '@tanstack/react-query';

import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@api/products.api';

import type { ProductsResponse } from '@domain/product';

const PAGE_SIZE = 7;

export type ProductsMode =
  | {
      type: 'all';
    }
  | {
      type: 'search';
      query: string;
    }
  | {
      type: 'category';
      category: string;
    };

export const useProducts = (mode: ProductsMode) => {
  return useInfiniteQuery<ProductsResponse>({
    queryKey: ['products', mode],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => {
      const skip = pageParam as number;

      switch (mode.type) {
        case 'search':
          return searchProducts(mode.query, PAGE_SIZE, skip, signal);

        case 'category':
          return getProductsByCategory(mode.category, PAGE_SIZE, skip, signal);

        case 'all':
        default:
          return getProducts(PAGE_SIZE, skip, signal);
      }
    },

    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      if (nextSkip >= lastPage.total) {
        return undefined;
      }
      return nextSkip;
    },

    staleTime: 30_000,
  });
};

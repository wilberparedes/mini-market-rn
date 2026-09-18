import { useQuery } from '@tanstack/react-query';

import { getProduct } from '@api/products.api';

export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: ({ signal }) => getProduct(productId, signal),
    enabled: Number.isFinite(productId),
    staleTime: 1000 * 60 * 5,
  });
};

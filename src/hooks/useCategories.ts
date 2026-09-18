import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@api/products.api';

export const useCategories = () => {
  return useQuery({
    queryKey: ['product-categories'],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 5 * 60 * 1000,
  });
};

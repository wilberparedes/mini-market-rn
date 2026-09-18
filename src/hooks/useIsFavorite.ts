import { useFavoriteStore } from '@store/favorites.store';

export const useIsFavorite = (productId: number) => {
  return useFavoriteStore((state) =>
    state.favorites.some((item) => item.id === productId),
  );
};

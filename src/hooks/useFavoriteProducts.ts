import { useFavoriteStore } from '@store/favorites.store';

export const useFavoriteProducts = () => {
  const favorites = useFavoriteStore((state) => state.favorites);

  return {
    favorites,
    favoriteCount: favorites.length,
  };
};

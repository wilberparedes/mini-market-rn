import type { FavoriteProduct } from '@domain/product';

export interface FavoriteState {
  favorites: FavoriteProduct[];
  addFavorite: (product: FavoriteProduct) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  toggleFavorite: (product: FavoriteProduct) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  setFavorites: (favorites: FavoriteProduct[]) => void;
  loadFavorites: () => Promise<void>;
}

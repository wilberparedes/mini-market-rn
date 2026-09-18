import { createMMKV } from 'react-native-mmkv';

import type { FavoriteProduct } from '@domain/product';

const storage = createMMKV();

const FAVORITES_KEY = 'favorites';

const FavoriteStorage = {
  getFavorites: async (): Promise<FavoriteProduct[]> => {
    const value = storage.getString(FAVORITES_KEY);

    if (!value) {
      return [];
    }

    try {
      const parsed: unknown = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as FavoriteProduct[];
    } catch {
      return [];
    }
  },

  saveFavorites: async (favorites: FavoriteProduct[]): Promise<void> => {
    storage.set(FAVORITES_KEY, JSON.stringify(favorites));
  },
};

export default FavoriteStorage;

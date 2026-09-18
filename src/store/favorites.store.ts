import { create } from 'zustand';

import FavoriteStorage from '@storage/favorites.storage';

import type { FavoriteState } from './favorite.types';

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],

  addFavorite: async (product) => {
    const favorites = get().favorites;
    const exists = favorites.some((item) => item.id === product.id);
    if (exists) {
      return;
    }
    const updated = [...favorites, product];
    set({ favorites: updated });
    await FavoriteStorage.saveFavorites(updated);
  },

  removeFavorite: async (productId) => {
    const favorites = get().favorites;
    const updated = favorites.filter((item) => item.id !== productId);
    set({ favorites: updated });
    await FavoriteStorage.saveFavorites(updated);
  },

  toggleFavorite: async (product) => {
    const favorites = get().favorites;
    const exists = favorites.some((item) => item.id === product.id);
    const updated = exists
      ? favorites.filter((item) => item.id !== product.id)
      : [...favorites, product];
    set({ favorites: updated });
    await FavoriteStorage.saveFavorites(updated);
  },

  isFavorite: (productId) =>
    get().favorites.some((item) => item.id === productId),

  setFavorites: (favorites) => set({ favorites }),

  loadFavorites: async () => {
    const favorites = await FavoriteStorage.getFavorites();
    set({ favorites });
  },
}));

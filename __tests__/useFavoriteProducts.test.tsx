import { renderHook } from '@testing-library/react-native';

import { useFavoriteProducts } from '@hooks/useFavoriteProducts';
import { useFavoriteStore } from '@store/favorites.store';

jest.mock('@store/favorites.store', () => ({
  useFavoriteStore: jest.fn(),
}));

const mockedUseFavoriteStore = jest.mocked(useFavoriteStore);

describe('useFavoriteProducts', () => {
  it('returns favorites and the favorite count', async () => {
    const favorites = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        discountPercentage: 10,
        thumbnail: 'https://example.com/1.jpg',
      },
      {
        id: 2,
        title: 'Product 2',
        price: 200,
        discountPercentage: 20,
        thumbnail: 'https://example.com/2.jpg',
      },
    ];

    mockedUseFavoriteStore.mockImplementation((selector) =>
      selector({
        favorites,
      } as ReturnType<typeof useFavoriteStore.getState>),
    );

    const { result } = await renderHook(() => useFavoriteProducts());

    expect(result.current.favorites).toEqual(favorites);
    expect(result.current.favoriteCount).toBe(2);
  });

  it('returns zero when there are no favorites', async () => {
    mockedUseFavoriteStore.mockImplementation((selector) =>
      selector({
        favorites: [],
      } as unknown as ReturnType<typeof useFavoriteStore.getState>),
    );

    const { result } = await renderHook(() => useFavoriteProducts());

    expect(result.current.favorites).toEqual([]);
    expect(result.current.favoriteCount).toBe(0);
  });
});

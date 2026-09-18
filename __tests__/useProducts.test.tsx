import React from 'react';
import { Text } from 'react-native';
import { render, waitFor, cleanup } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useProducts } from '@hooks/useProducts';
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '@api/products.api';

jest.mock('@api/products.api', () => ({
  getProducts: jest.fn(),
  getProductsByCategory: jest.fn(),
  searchProducts: jest.fn(),
}));

const mockedGetProducts = jest.mocked(getProducts);
const mockedSearchProducts = jest.mocked(searchProducts);
const mockedGetProductsByCategory = jest.mocked(getProductsByCategory);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

const TestComponent = ({
  mode,
}: {
  mode: Parameters<typeof useProducts>[0];
}) => {
  const { data, isSuccess } = useProducts(mode);

  if (!isSuccess) {
    return <Text>loading</Text>;
  }

  const count = data.pages.reduce(
    (total, page) => total + page.products.length,
    0,
  );

  return <Text>products:{count}</Text>;
};

describe('useProducts', () => {
  afterEach(() => {
    cleanup();
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('fetches products in all mode', async () => {
    mockedGetProducts.mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 7,
    });

    const { getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <TestComponent mode={{ type: 'all' }} />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(getByText('products:0')).toBeTruthy();
    });

    expect(mockedGetProducts).toHaveBeenCalledWith(
      7,
      0,
      expect.any(AbortSignal),
    );
  });

  it('searches products in search mode', async () => {
    mockedSearchProducts.mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 7,
    });

    const { getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          mode={{
            type: 'search',
            query: 'phone',
          }}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(getByText('products:0')).toBeTruthy();
    });

    expect(mockedSearchProducts).toHaveBeenCalledWith(
      'phone',
      7,
      0,
      expect.any(AbortSignal),
    );
  });

  it('fetches products by category', async () => {
    mockedGetProductsByCategory.mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 7,
    });

    const { getByText } = await render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          mode={{
            type: 'category',
            category: 'smartphones',
          }}
        />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(getByText('products:0')).toBeTruthy();
    });

    expect(mockedGetProductsByCategory).toHaveBeenCalledWith(
      'smartphones',
      7,
      0,
      expect.any(AbortSignal),
    );
  });
});

import apiClient from '@api/client';
import { Category } from '@domain/category';
import { Product, ProductsResponse } from '@domain/product';

export const getProducts = async (
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/products', {
    params: {
      limit,
      skip,
    },
    signal,
  });

  return response.data;
};

export const getProduct = async (
  id: number,
  signal?: AbortSignal,
): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`, {
    signal,
  });

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/products/search', {
    params: {
      q: query,
      limit,
      skip,
    },
    signal,
  });

  return response.data;
};

export const getCategories = async (
  signal?: AbortSignal,
): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/products/categories', {
    signal,
  });

  return response.data;
};

export const getProductsByCategory = async (
  category: string,
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params: {
        limit,
        skip,
      },
      signal,
    },
  );

  return response.data;
};

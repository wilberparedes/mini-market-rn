import React, { useCallback, useMemo, useState } from 'react';

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useDebounce } from 'use-debounce';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ProductCard } from '@components/ProductCard';
import type { Product } from '@domain/product';
import type { ProductsStackParamList } from '@navigation/types';
import { useCategories } from '@hooks/useCategories';
import { useProducts, type ProductsMode } from '@hooks/useProducts';
import { useFavoriteStore } from '@store/favorites.store';
import { Skeleton, SkeletonList } from '@components/Skeleton';
import { toFavoriteProduct } from '@utils/product.utils';
import { SkeletonCategoryList } from '@components/SkeletonCategory';

type Props = NativeStackScreenProps<ProductsStackParamList, 'Products'>;

const DEBOUNCE_MS = 350;

export const ProductsScreen = ({ navigation }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [debouncedSearch] = useDebounce(searchText, DEBOUNCE_MS);
  const favorites = useFavoriteStore((state) => state.favorites);

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const mode = useMemo<ProductsMode>(() => {
    if (selectedCategory) {
      return {
        type: 'category',
        category: selectedCategory,
      };
    }

    if (debouncedSearch.trim()) {
      return {
        type: 'search',
        query: debouncedSearch.trim(),
      };
    }

    return {
      type: 'all',
    };
  }, [debouncedSearch, selectedCategory]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useProducts(mode);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refreshCategories,
  } = useCategories();

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshCategories();
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refreshCategories]);

  const products = useMemo(
    () => data?.pages.flatMap((page) => page.products) ?? [],
    [data],
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);

    if (text.trim()) {
      setSelectedCategory(null);
    }
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    setSelectedCategory((current) => (current === category ? null : category));

    setSearchText('');
  }, []);

  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetail', {
        productId,
      });
    },
    [navigation],
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => {
      return (
        <ProductCard
          product={item}
          isFavorite={favorites.some((favorite) => favorite.id === item.id)}
          onPress={() => handleProductPress(item.id)}
          onToggleFavorite={() => toggleFavorite(toFavoriteProduct(item))}
        />
      );
    },
    [favorites, handleProductPress, toggleFavorite],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No pudimos cargar los productos</Text>
        <Text style={styles.errorMessage}>
          Revisa tu conexión e inténtalo nuevamente.
        </Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <TextInput
        value={searchText}
        onChangeText={handleSearchChange}
        placeholder="Buscar productos..."
        placeholderTextColor="#888888"
        style={styles.searchInput}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Buscar productos"
      />

      {isCategoriesError ? (
        <View style={styles.categoryError}>
          <Text>No pudimos cargar las categorías.</Text>
        </View>
      ) : (
        <>
          {isLoadingCategories ? (
            <SkeletonCategoryList />
          ) : (
            <FlatList
              horizontal
              data={categories ?? []}
              keyExtractor={(item) => item.slug}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({ item }) => {
                const isSelected = selectedCategory === item.name;
                return (
                  <Pressable
                    onPress={() => handleCategoryPress(item.name)}
                    style={[
                      styles.category,
                      isSelected && styles.categorySelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                    }}
                    accessibilityLabel={`Filtrar por ${item.name}`}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
              refreshing={refreshing}
            />
          )}
        </>
      )}

      {/* Products */}
      {(isLoading || isFetching) && !isFetchingNextPage ? (
        <SkeletonList />
      ) : (
        <FlatList
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
          ListFooterComponent={isFetchingNextPage ? <Skeleton /> : null}
          ListEmptyComponent={
            isFetchingNextPage || isLoading ? null : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No encontramos productos.</Text>
              </View>
            )
          }
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    marginBottom: 100,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    marginBottom: 20,
    color: '#666666',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#111111',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchInput: {
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  category: {
    marginRight: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelected: {
    backgroundColor: '#111111',
  },
  categoryText: {
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryError: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyText: {
    color: '#666666',
    fontSize: 15,
  },
});

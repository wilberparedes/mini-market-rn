import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@components/ProductCard';
import { useFavoriteProducts } from '@hooks/useFavoriteProducts';
import type { FavoriteProduct } from '@domain/product';
import { useFavoriteStore } from '@store/favorites.store';
import { toFavoriteProduct } from '@utils/product.utils';

export const FavoritesScreen = () => {
  const { favorites } = useFavoriteProducts();
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  const handleRemoveFavorite = useCallback(
    (product: FavoriteProduct) => {
      toggleFavorite(toFavoriteProduct(product));
    },
    [toggleFavorite],
  );

  const renderProduct = useCallback(
    ({ item }: { item: FavoriteProduct }) => {
      return (
        <ProductCard
          product={item}
          isFavorite
          onPress={() => {}}
          onToggleFavorite={() => handleRemoveFavorite(item)}
        />
      );
    },
    [handleRemoveFavorite],
  );

  const keyExtractor = useCallback(
    (item: FavoriteProduct) => item.id.toString(),
    [],
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>♡</Text>
        <Text style={styles.emptyTitle}>No tienes favoritos</Text>
        <Text style={styles.emptyMessage}>
          Agrega productos a favoritos y aparecerán aquí.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={keyExtractor}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>No tienes favoritos</Text>
            <Text style={styles.emptyMessage}>
              Agrega productos a favoritos y aparecerán aquí.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },

  headerTitle: {
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#555555',
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
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

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  emptyIcon: {
    fontSize: 56,
    color: '#CCCCCC',
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  emptyMessage: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: '#777777',
  },
});

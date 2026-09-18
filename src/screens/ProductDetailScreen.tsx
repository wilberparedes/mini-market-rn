import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useProduct } from '@hooks/useProduct';
import type { ProductsStackParamList } from '@navigation/types';
import { useFavoriteStore } from '@store/favorites.store';
import { useIsFavorite } from '@hooks/useIsFavorite';
import { toFavoriteProduct } from '@utils/product.utils';
import { SkeletonProductDetails } from '@components/SkeletonProductDetails';
import { CurrencyFormatterApi } from '@native/CurrencyFormatter';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number,
): number => {
  return price * (1 - discountPercentage / 100);
};

const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

const renderStars = (rating: number): string => {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? '★' : '☆',
  ).join('');
};

interface ImageItemProps {
  uri: string;
}

const ProductImage = ({ uri }: ImageItemProps) => {
  return (
    <View style={styles.imageSlide}>
      <Image
        source={{ uri, cache: 'force-cache' }}
        style={styles.productImage}
        resizeMode="cover"
        accessibilityRole="image"
      />
    </View>
  );
};

export const ProductDetailScreen = ({ route }: Props) => {
  const { productId } = route.params;
  const [formattedPrice, setFormattedPrice] = useState('');

  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useProduct(productId);

  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const isFavorite = useIsFavorite(productId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const favoriteScale = useSharedValue(1);
  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: favoriteScale.value,
        },
      ],
    };
  });

  const handleToggleFavorite = useCallback(() => {
    favoriteScale.value = withSequence(
      withSpring(1.2, {
        damping: 6,
        stiffness: 300,
      }),
      withTiming(1, {
        duration: 180,
      }),
    );

    toggleFavorite(toFavoriteProduct(product!));
  }, [favoriteScale, product, toggleFavorite]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [productId]);

  useEffect(() => {
    if (!product) {
      return;
    }

    let mounted = true;
    CurrencyFormatterApi.format(
      calculateDiscountedPrice(product.price, product.discountPercentage),
      'USD',
      'en-US',
    ).then((value) => {
      if (mounted) {
        setFormattedPrice(value);
      }
    });

    return () => {
      mounted = false;
    };
  }, [product]);

  const images = useMemo(() => {
    if (!product) {
      return [];
    }

    // Evitar imágenes duplicadas.
    return Array.from(
      new Set([product.thumbnail, ...product.images].filter(Boolean)),
    );
  }, [product]);

  const handleImageScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: {
          x: number;
        };
      };
    }) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      setCurrentImageIndex(index);
    },
    [],
  );

  const renderImage = useCallback(({ item }: { item: string }) => {
    return <ProductImage uri={item} />;
  }, []);

  const imageKeyExtractor = useCallback(
    (item: string, index: number) => `${item}-${index}`,
    [],
  );

  if (isLoading) {
    return <SkeletonProductDetails />;
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No pudimos cargar el producto</Text>
        <Text style={styles.errorMessage}>
          Revisa tu conexión e inténtalo nuevamente.
        </Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => refetch()}
          accessibilityRole="button"
          accessibilityLabel="Reintentar cargar producto"
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={imageKeyExtractor}
          renderItem={renderImage}
          onMomentumScrollEnd={handleImageScroll}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          windowSize={3}
          removeClippedSubviews
        />

        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((image, index) => (
              <View
                key={`${image}-indicator-${index}`}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.title}</Text>
          <Animated.View style={favoriteAnimatedStyle}>
            <Pressable
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive,
              ]}
              onPress={handleToggleFavorite}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{
                selected: isFavorite,
              }}
              accessibilityLabel={
                isFavorite
                  ? `Quitar ${product.title} de favoritos`
                  : `Agregar ${product.title} a favoritos`
              }
            >
              <Text
                style={[
                  styles.favoriteIcon,
                  isFavorite && styles.favoriteIconActive,
                ]}
              >
                {isFavorite ? '♥' : '♡'}
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        <View
          style={styles.ratingContainer}
          accessible
          accessibilityLabel={`Rating ${product.rating} de 5`}
        >
          <Text style={styles.stars}>{renderStars(product.rating)}</Text>
          <Text style={styles.ratingValue}>{product.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
          <Text style={styles.discountedPrice}>{formattedPrice}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>

        {product.tags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tags</Text>

            <View style={styles.tagsContainer}>
              {product.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Categoría</Text>
          <Text style={styles.categoryValue}>{product.category}</Text>
        </View>

        {isFetching && (
          <ActivityIndicator size="small" style={styles.refreshIndicator} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  contentContainer: {
    paddingBottom: 32,
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

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  carouselContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },

  imageSlide: {
    width: SCREEN_WIDTH,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
  },

  paginationDotActive: {
    width: 20,
    backgroundColor: '#111111',
  },

  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  title: {
    flex: 1,
    marginRight: 16,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#111111',
  },

  favoriteButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },

  favoriteButtonActive: {
    backgroundColor: '#FFF0F0',
  },

  favoriteIcon: {
    fontSize: 30,
    color: '#111111',
  },

  favoriteIconActive: {
    color: '#E53935',
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  stars: {
    fontSize: 20,
    letterSpacing: 2,
    color: '#F5A623',
  },

  ratingValue: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#555555',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  originalPrice: {
    marginRight: 10,
    fontSize: 16,
    color: '#888888',
    textDecorationLine: 'line-through',
  },

  discountedPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
  },

  discountBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#111111',
  },

  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#555555',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },

  tagText: {
    fontSize: 13,
    color: '#555555',
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#DDDDDD',
  },

  categoryLabel: {
    fontSize: 14,
    color: '#888888',
  },

  categoryValue: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },

  refreshIndicator: {
    marginTop: 16,
  },
});

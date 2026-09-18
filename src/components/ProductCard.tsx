import React, { memo, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { FavoriteProduct, Product } from '@domain/product';

interface ProductCardProps {
  product: Product | FavoriteProduct;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number,
): number => {
  return price * (1 - discountPercentage / 100);
};

export const ProductCard = memo(
  ({ product, isFavorite, onPress, onToggleFavorite }: ProductCardProps) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(16);

    const favoriteScale = useSharedValue(1);

    useEffect(() => {
      opacity.value = withTiming(1, {
        duration: 350,
      });
      translateY.value = withTiming(0, {
        duration: 350,
      });
    }, [opacity, translateY]);

    const animatedCardStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [
          {
            translateY: translateY.value,
          },
        ],
      };
    });

    const favoriteAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: favoriteScale.value,
          },
        ],
      };
    });

    const handleFavoritePress = () => {
      favoriteScale.value = withSequence(
        withSpring(1.15, {
          damping: 7,
          stiffness: 300,
        }),
        withTiming(1, {
          duration: 150,
        }),
      );
      onToggleFavorite();
    };

    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discountPercentage,
    );

    return (
      <Animated.View style={animatedCardStyle}>
        <View style={styles.card}>
          <Pressable
            style={styles.productPressable}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Ver ${product.title}`}
          >
            <Image
              source={{ uri: product.thumbnail, cache: 'force-cache' }}
              style={styles.image}
              resizeMode="cover"
              accessibilityRole="image"
              accessibilityLabel={`Imagen de ${product.title}`}
            />
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {product.title}
              </Text>
              <Text style={styles.originalPrice}>
                ${product.price.toFixed(2)}
              </Text>

              <Text style={styles.discountedPrice}>
                ${discountedPrice.toFixed(2)}
              </Text>
            </View>
          </Pressable>

          <Animated.View
            style={[styles.favoriteAnimatedContainer, favoriteAnimatedStyle]}
          >
            <Pressable
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive,
              ]}
              onPress={handleFavoritePress}
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
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#EEEEEE',
  },
  content: {
    flex: 1,
    padding: 14,
    paddingRight: 56,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  originalPrice: {
    marginTop: 10,
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  favoriteAnimatedContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFF0F0',
  },
  favoriteIcon: {
    fontSize: 25,
    color: '#111111',
  },
  favoriteIconActive: {
    color: '#E53935',
  },
});

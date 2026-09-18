// src/components/ProductSkeleton.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const Skeleton = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.image} />

      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.price} />
        <View style={styles.discountedPrice} />
      </View>

      <View style={styles.favorite} />
    </Animated.View>
  );
};

export const SkeletonList = () => {
  return (
    <View>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    height: 120,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#DDDDDD',
  },
  content: {
    flex: 1,
    padding: 14,
  },
  title: {
    width: '80%',
    height: 18,
    borderRadius: 6,
    backgroundColor: '#D5D5D5',
  },
  price: {
    width: '40%',
    height: 13,
    marginTop: 18,
    borderRadius: 6,
    backgroundColor: '#D5D5D5',
  },
  discountedPrice: {
    width: '50%',
    height: 20,
    marginTop: 7,
    borderRadius: 6,
    backgroundColor: '#D5D5D5',
  },
  favorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D5D5D5',
  },
});

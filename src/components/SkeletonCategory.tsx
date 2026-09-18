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

export const SkeletonCategory = () => {
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
    </Animated.View>
  );
};

export const SkeletonCategoryList = () => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCategory key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    marginLeft: 16,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#EEEEEE',
    width: 110,
    overflow: 'hidden',
  },
  image: {
    width: 110,
    height: 30,
    backgroundColor: '#DDDDDD',
  },
});

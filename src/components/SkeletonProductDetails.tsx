import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export const SkeletonProductDetails = () => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView style={[styles.container, animatedStyle]}>
      {/* Image */}
      <View style={styles.image} />

      {/* Dots */}
      <View style={styles.dots}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.title} />
        <View style={styles.titleShort} />

        {/* Rating */}
        <View style={styles.rating} />

        {/* Prices */}
        <View style={styles.originalPrice} />
        <View style={styles.discountedPrice} />

        {/* Description */}
        <View style={styles.description} />
        <View style={styles.description} />
        <View style={styles.descriptionShort} />

        {/* Tags */}
        <View style={styles.tags}>
          <View style={styles.tag} />
          <View style={styles.tagSmall} />
          <View style={styles.tag} />
        </View>
      </View>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E5E5',
  },

  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 12,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D5D5D5',
  },

  activeDot: {
    width: 20,
  },

  content: {
    padding: 20,
  },

  title: {
    width: '85%',
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  titleShort: {
    width: '55%',
    height: 24,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  rating: {
    width: 110,
    height: 18,
    marginTop: 16,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  originalPrice: {
    width: 90,
    height: 16,
    marginTop: 20,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  discountedPrice: {
    width: 140,
    height: 26,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: '#D5D5D5',
  },

  description: {
    width: '100%',
    height: 14,
    marginTop: 24,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  descriptionShort: {
    width: '70%',
    height: 14,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
  },

  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },

  tag: {
    width: 70,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5E5',
  },

  tagSmall: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5E5',
  },
});

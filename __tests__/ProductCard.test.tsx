import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ProductCard } from '@components/ProductCard';

const product = {
  id: 1,
  title: 'iPhone 15',
  description: 'Smartphone',
  price: 1000,
  discountPercentage: 20,
  rating: 4.5,
  thumbnail: 'https://example.com/iphone.jpg',
  images: ['https://example.com/iphone.jpg'],
  tags: ['phone'],
  category: 'smartphones',
};

describe('ProductCard', () => {
  it('renders product information and discounted price', async () => {
    const { getByText } = await render(
      <ProductCard
        product={product}
        isFavorite={false}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
      />,
    );

    expect(getByText('iPhone 15')).toBeTruthy();
    expect(getByText('$1000.00')).toBeTruthy();
    expect(getByText('$800.00')).toBeTruthy();
  });

  it('calls onToggleFavorite when favorite button is pressed', async () => {
    const onToggleFavorite = jest.fn();

    const { getByRole } = await render(
      <ProductCard
        product={product}
        isFavorite={false}
        onPress={jest.fn()}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.press(
      getByRole('button', {
        name: 'Agregar iPhone 15 a favoritos',
      }),
    );

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });
});

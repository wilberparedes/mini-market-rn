import { toFavoriteProduct } from '@utils/product.utils';

describe('toFavoriteProduct', () => {
  it('converts a product into a favorite product', () => {
    const product = {
      id: 1,
      title: 'iPhone 15',
      description: 'Smartphone',
      price: 999,
      discountPercentage: 10,
      rating: 4.8,
      thumbnail: 'https://example.com/iphone.jpg',
      images: ['https://example.com/iphone.jpg'],
      tags: ['phone'],
      category: 'smartphones',
    };

    expect(toFavoriteProduct(product)).toEqual({
      id: 1,
      title: 'iPhone 15',
      price: 999,
      discountPercentage: 10,
      thumbnail: 'https://example.com/iphone.jpg',
    });
  });
});

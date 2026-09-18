import { FavoriteProduct, Product } from '@domain/product';

export const toFavoriteProduct = (product: Product | FavoriteProduct) => ({
  id: product.id,
  title: product.title,
  price: product.price,
  discountPercentage: product.discountPercentage,
  thumbnail: product.thumbnail,
});

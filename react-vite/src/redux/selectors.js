import { createSelector } from 'reselect';

const selectProducts = (state) => state.products;

export const selectProductById = createSelector(
  [selectProducts, (state, id) => id],
  (products, id) => {
    return products[id] || Object.values(products).find((product) => product.id === id);
  }
);
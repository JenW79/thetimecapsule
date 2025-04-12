import { useEffect } from 'react';
// importing react is deprecated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/products';
import ProductItem from './ProductItem';
import './Products.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const productsObj = useSelector(state => state.products);
  const products = Object.values(productsObj);
  
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (!products.length) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      <h2>All Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductItem 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
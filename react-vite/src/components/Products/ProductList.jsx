import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/products';
import ProductItem from './ProductItem';
import { useLocation } from 'react-router-dom';
import './Products.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const productsObj = useSelector(state => state.products);
  const products = Object.values(productsObj);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const decade = queryParams.get('decade');
  const selectedCategory = queryParams.get('category');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  let filteredProducts = products;

  if (decade) {
    filteredProducts = filteredProducts.filter(product => product.decade === decade);
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
  }

  if (!filteredProducts.length) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      <h2>
        {decade ? `${decade} Products` : 'All Products'}
        {selectedCategory ? ` - ${selectedCategory}` : ''}
      </h2>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
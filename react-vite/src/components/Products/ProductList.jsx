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

  // useEffect(() => {
  //   dispatch(fetchProducts());
  // }, [dispatch]); // filter catagories and decades more clearly to stop rendering issues

  useEffect(() => {
    let query = "";
  
    if (decade || selectedCategory) {
      const params = new URLSearchParams();
      if (decade) params.append("decade", decade);
      if (selectedCategory) params.append("category", selectedCategory);
      query = "?" + params.toString();
    }
  
    dispatch(fetchProducts(query));
  }, [dispatch, decade, selectedCategory]);

  let filteredProducts = products;

  // if (decade) {
  //   filteredProducts = filteredProducts.filter(product => product.decade === decade);
  // }

  // if (selectedCategory) {
  //   filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
  // }  already filtering from backend. 


  // // hide products owned
  // const sessionUser = useSelector((state) => state.session.user);
  // if (sessionUser) {
  //   filteredProducts = filteredProducts.filter(
  //     (product) => product.owner?.id !== sessionUser.id
  //   );
  // } 

  // //hide products owned ^  
  // doing this prevents products from being shown, making it look
  // like the products dont exist at all. User 1 owns all 3 80's products in the seed. 

  // if (!filteredProducts.length) {
  //   return <div className="loading">Loading products...</div>;
  // } ambiuguous and confusing for users(had me confused too)

  if (!filteredProducts.length) {
    return (
      <div className="empty-message">
        No products found in this category.
      </div>
    );
  }  // can keep this or change to your preference. 

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
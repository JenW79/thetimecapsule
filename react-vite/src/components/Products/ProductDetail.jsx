import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../../redux/products';
import ProductItem from './ProductItem';
import ReviewList from '../Reviews/ReviewList';
import './Products.css';
import '../Reviews/Reviews.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const product = useSelector(state => state.products[parseInt(id)]);
  
  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);
  
  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }
  
  return (
    <div className="product-detail-page">
      <ProductItem product={product} />
      <ReviewList />
    </div>
    
  );
};

export default ProductDetail;
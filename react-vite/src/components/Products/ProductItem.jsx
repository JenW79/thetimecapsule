import { useState } from 'react';
// importing react is depreciated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch } from 'react-redux';
import { editProduct} from '../../redux/products';
import { addToCart } from '../../redux/cart';
import EditProductForm from './EditProductForm';
import DeleteProduct from './DeleteProduct';
import FavoriteButton from '../Favorites/FavoriteButton';


const ProductItem = ({ product, onProductDeleted }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleProductUpdate = async (updatedData) => {
    await dispatch(editProduct(product.id, updatedData));
    setIsEditing(false);
  };


  return (
    <div className="product-item">
      {isEditing ? (
        <EditProductForm 
          product={product}
          onProductUpdated={handleProductUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          
          <div className="product-actions">
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <DeleteProduct productId={product.id} />
            <FavoriteButton productId={product.id} onDeleted={onProductDeleted} />
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductItem;
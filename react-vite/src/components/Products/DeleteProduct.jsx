import { useState } from 'react'; 
// importing react is deprecated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch } from 'react-redux';
import { removeProduct } from '../../redux/products';
import './Products.css';

const DeleteProduct = ({ productId }) => {
  const dispatch = useDispatch();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    setConfirming(true);
  };

  const handleCancelDelete = () => {
    setConfirming(false);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await dispatch(removeProduct(productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="delete-confirmation">
        <p>Are you sure?</p>
        <div className="confirmation-buttons">
          <button 
            className="confirm-delete-button"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button 
            className="cancel-delete-button"
            onClick={handleCancelDelete}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      className="delete-button"
      onClick={handleDeleteClick}
    >
      Delete
    </button>
  );
};

export default DeleteProduct;
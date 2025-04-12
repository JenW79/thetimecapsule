import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFavorite, deleteFavorite } from '../../redux/favorites';
import './Favorites.css';

const FavoriteButton = ({ productId }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites);
  
  // Find if this product is already favorited
  const favorite = Object.values(favorites).find(fav => 
    fav.product && fav.product.id === productId
  );
  
  const handleToggleFavorite = async () => {
    if (favorite) {
      // Remove from favorites using the favorite's id (not the product id)
      await dispatch(deleteFavorite(favorite.id));
    } else {
      // Add to favorites using the product id
      await dispatch(createFavorite(productId));
    }
  };

  return (
    <button 
      className={`favorite-button ${favorite ? 'favorite-active' : ''}`}
      onClick={handleToggleFavorite}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorite ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
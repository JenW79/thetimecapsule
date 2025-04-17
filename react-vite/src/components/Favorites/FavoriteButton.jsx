// import React from 'react';// depreciated as Vite with React 17+ and JSX transform, 
// you no longer need to import React in every file.
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
      await dispatch(deleteFavorite(favorite.id));
    } else {
      await dispatch(createFavorite(productId));
    }
  
    // // Refresh state
    // await dispatch(fetchFavorites());
  };

  return (
    <button 
      className={`favorite-button ${favorite ? 'favorite-active' : ''}`}
      onClick={handleToggleFavorite}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* {favorite ? '❤️' : '🤍'} */}
      🩷
    </button>
  );
};

export default FavoriteButton;
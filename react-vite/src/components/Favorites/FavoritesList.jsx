import { useEffect } from 'react'; 
//importing react is depreciated as Vite with React 17+ 
// and JSX transform, 
// you no longer need to import React in every file.
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../redux/favorites';
import ProductItem from '../Products/ProductItem';
import './Favorites.css';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const favoritesObj = useSelector(state => state.favorites);
  const favorites = Object.values(favoritesObj);
  
  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (!favorites || !favorites.length) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-list">
      <h2>Your Favorite Products</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites-message">You haven&apos;t added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <ProductItem 
              key={favorite.id} 
              product={favorite.product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
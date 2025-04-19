import { useEffect, useMemo } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../redux/favorites';
import ProductItem from '../Products/ProductItem';
import './Favorites.css';

const FavoritesList = () => {
  const dispatch = useDispatch();
  const favoritesObj = useSelector(state => state.favorites);
  const favorites = useMemo(() => Object.values(favoritesObj), [favoritesObj]);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (!favorites || favorites.length === 0) {
    return <div className="loading">Loading favorites...</div>;
  }

  return (
    <div className="favorites-section">
      <h2 className="favorites-title">Your Favorite Products</h2>
      {favorites.length === 0 ? (
        <p className="no-favorites-message">You haven’t added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <ProductItem 
              key={favorite.id} 
              product={favorite.product}
              isFavorite={true}  
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
import { useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../redux/favorites";
import ProductItem from "../Products/ProductItem";
import "./Favorites.css";

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

  if (favorites.length === 0) {
    return (
      <div className="no-favorites-message">
        <h2>You haven’t favorited anything yet 💔</h2>
        <p>Head over to the products page and show some love!</p>
        <Link to="/products">
          <button className="ctaButtonSmall">Browse Products</button>
        </Link>
      </div>
    );
  }
  return (
    <div className="favorites-section">
      <h1 className="favorites-title">Your Favorite Products</h1>
      {favorites.length === 0 ? (
        <p className="no-favorites-message">
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
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
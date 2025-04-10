const LOAD_FAVORITES = 'favorites/load';
const ADD_FAVORITE = 'favorites/add';
const REMOVE_FAVORITE = 'favorites/remove';

const loadFavorites = (favorites) => ({type: LOAD_FAVORITES, favorites});
const addFavorite = (favorite) => ({type: ADD_FAVORITE, favorite });
const removeFavorite = (favoriteId) => ({type: REMOVE_FAVORITE, favoriteId });

//THUNKS

export const fetchFavorites = () => async (dispatch) => {
    const res = await fetch('/api/favorites');
    if (res.ok){
        const data = await res.json()
        dispatch(loadFavorites(data))
    }
}
export const createFavorite = (productId) => async (dispatch) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(addFavorite(data));
      return data;
    } else {
      const error = await res.json();
      return error;
    }
  };
  export const deleteFavorite = (favoriteId) => async (dispatch) => {
    const res = await fetch(`/api/favorites/${favoriteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      dispatch(removeFavorite(favoriteId));
    }
  };

const initialState = {};

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FAVORITES: {
      const newState = {};
      action.favorites.forEach((fav) => {
        newState[fav.id] = fav;
      });
      return newState;
    }
    case ADD_FAVORITE:
      return { ...state, [action.favorite.id]: action.favorite };
    case REMOVE_FAVORITE: {
      const newState = { ...state};
      delete newState[action.favoriteId];
      return newState;
    }
    default:
      return state;
  }
}

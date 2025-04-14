import { fetchWithAuth } from "../utils/fetchHelpers";

export const INCREMENT_ITEM = 'INCREMENT_ITEM';
export const DECREMENT_ITEM = 'DECREMENT_ITEM';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const FETCH_CART = 'FETCH_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const incrementItem = (productId) => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const cartItems = getState().cart.cartItems;
        const item = cartItems.find(item => item.id === productId);

        if (item) {
          const response = await fetchWithAuth("/api/cart", "POST", [{
            id: item.product_id || productId,
            quantity: 1
          }]);

          if (response.ok) {
            dispatch({
              type: INCREMENT_ITEM,
              payload: productId,
            });
          }
        }
      } catch (error) {
        console.error("Error incrementing item:", error);
      }
    } else {
      dispatch({
        type: INCREMENT_ITEM,
        payload: productId,
      });
    }
  };
};

export const decrementItem = (productId) => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const cartItems = getState().cart.cartItems;
        const item = cartItems.find(item => item.id === productId);

        if (item && item.quantity > 1) {
          await fetchWithAuth(`/api/cart/${productId}`, "DELETE");
          if (item.quantity > 1) {
            await fetchWithAuth("/api/cart", "POST", [{
              id: item.product_id || productId,
              quantity: item.quantity - 1
            }]);
          }
          dispatch({
            type: DECREMENT_ITEM,
            payload: productId,
          });
        } else if (item && item.quantity === 1) {
          await fetchWithAuth(`/api/cart/${productId}`, "DELETE");
          dispatch({
            type: DECREMENT_ITEM,
            payload: productId,
          });
        }
      } catch (error) {
        console.error("Error decrementing item:", error);
      }
    } else {
      dispatch({
        type: DECREMENT_ITEM,
        payload: productId,
      });
    }
  };
};

export const addToCart = (product) => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const response = await fetchWithAuth("/api/cart", "POST", [{
          id: product.id,
          quantity: 1
        }]);

        if (response.ok) {
          dispatch({
            type: ADD_TO_CART,
            payload: product,
          });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      dispatch({
        type: ADD_TO_CART,
        payload: product,
      });
    }
  };
};

export const removeFromCart = (productId) => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const response = await fetchWithAuth(`/api/cart/${productId}`, "DELETE");
        if (response.ok) {
          dispatch({
            type: REMOVE_FROM_CART,
            payload: productId,
          });
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    } else {
      dispatch({
        type: REMOVE_FROM_CART,
        payload: productId,
      });
    }
  };
};

export const fetchCart = () => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const response = await fetchWithAuth("/api/cart", "GET");
        if (response.ok) {
          const cartItems = await response.json();
          dispatch({
            type: FETCH_CART,
            payload: cartItems,
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        dispatch({
          type: FETCH_CART,
          payload: cartItems,
        });
      }
    } else {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      dispatch({
        type: FETCH_CART,
        payload: cartItems,
      });
    }
  };
};

export const clearCart = () => {
  return async (dispatch, getState) => {
    const { session } = getState();
    const isAuthenticated = session && session.user;

    if (isAuthenticated) {
      try {
        const response = await fetchWithAuth("/api/cart", "DELETE");
        if (response.ok) {
          dispatch({
            type: CLEAR_CART,
          });
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      dispatch({
        type: CLEAR_CART,
      });
    }
  };
};

const initialState = {
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART: {
      return { ...state, cartItems: action.payload };
    }
    case INCREMENT_ITEM: {
      const incrementedItems = state.cartItems.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      localStorage.setItem('cartItems', JSON.stringify(incrementedItems));
      return { ...state, cartItems: incrementedItems };
    }
    case DECREMENT_ITEM: {
      const decrementedItems = state.cartItems.map((item) =>
        item.id === action.payload
          ? item.quantity === 1
            ? null
            : { ...item, quantity: item.quantity - 1 }
          : item
      );
      const updatedItems = decrementedItems.filter(item => item !== null);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return { ...state, cartItems: updatedItems };
    }
    case ADD_TO_CART: {
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = state.cartItems.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        updatedItems = [...state.cartItems, newItem];
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return { ...state, cartItems: updatedItems };
    }
    case REMOVE_FROM_CART: {
      const filteredItems = action.payload === 'all'
        ? []
        : state.cartItems.filter((item) => item.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(filteredItems));
      return { ...state, cartItems: filteredItems };
    }
    case CLEAR_CART: {
      localStorage.setItem('cartItems', JSON.stringify([]));
      return { ...state, cartItems: [] };
    }
    default:
      return state;
  }
};

export default cartReducer;
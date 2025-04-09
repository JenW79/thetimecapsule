export const INCREMENT_ITEM = 'INCREMENT_ITEM';
export const DECREMENT_ITEM = 'DECREMENT_ITEM';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const FETCH_CART = 'FETCH_CART';
export const CLEAR_CART = 'CLEAR_CART';

export const incrementItem = (productId) => ({
  type: INCREMENT_ITEM,
  payload: productId,
});

export const decrementItem = (productId) => ({
  type: DECREMENT_ITEM,
  payload: productId,
});

export const addToCart = (product) => {
  return {
    type: ADD_TO_CART,
    payload: product,
  };
};

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const fetchCart = () => {
  return (dispatch) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    dispatch({
      type: FETCH_CART,
      payload: cartItems,
    });
  };
};

export const clearCart = () => ({
  type: CLEAR_CART,
});

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
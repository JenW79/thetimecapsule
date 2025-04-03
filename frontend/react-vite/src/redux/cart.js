const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';

const initialState = {
    items: [],
};

export const addToCart = (product) => ({
    type: ADD_TO_CART,
    payload: product,
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: productId,
});

export const incrementItem = (productId) => ({
    type: INCREMENT_ITEM,
    payload: productId,
});

export const decrementItem = (productId) => ({
    type: DECREMENT_ITEM,
    payload: productId,
});

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    items: [...state.items, { ...action.payload, quantity: 1 }],
                };
            }
        }
        case REMOVE_FROM_CART: {
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };
        }
        case INCREMENT_ITEM: {
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
        }
        case DECREMENT_ITEM: {
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload
                        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                        : item
                ),
            };
        }
        default:
            return state;
    }
};

export default cartReducer;
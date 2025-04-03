const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREMENT_ITEM = 'INCREMENT_ITEM';
const DECREMENT_ITEM = 'DECREMENT_ITEM';
const CLEAR_CART = 'CLEAR_CART';

const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

const initialState = {
    // items: [],
    items: savedCartItems,
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

export const clearCart = () => {
    localStorage.removeItem('cartItems');
    return { type: 'CLEAR_CART'};
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            let updatedItems;

            if (existingItem) {
                // return {
                //     ...state,
                //     items: state.items.map(item =>
                //         item.id === action.payload.id
                //             ? { ...item, quantity: item.quantity + 1 }
                //             : item
                //     ),
                // };
                updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // return {
                //     ...state,
                //     items: [...state.items, { ...action.payload, quantity: 1 }],
                // };
                updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            // Save updated items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return {
                ...state,
                items: updatedItems,
            };
        }
        case REMOVE_FROM_CART: {
        //     return {
        //         ...state,
        //         items: state.items.filter(item => item.id !== action.payload),
        //     };
        // }
            const updatedItems = state.items.filter(item => item.id !== action.payload);

            // Save updated items to localStorage
            localStorage.setItem('cartItems', JSON.stringify(updatedItems));

            return {
                ...state,
                items: updatedItems,
            };
        }
        case INCREMENT_ITEM: {
        //     return {
        //         ...state,
        //         items: state.items.map(item =>
        //             item.id === action.payload
        //                 ? { ...item, quantity: item.quantity + 1 }
        //                 : item
        //         ),
        //     };
        // }
        const updatedItems = state.items.map(item =>
            item.id === action.payload
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        // Save updated items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));

        return {
            ...state,
            items: updatedItems,
        };
    }
        case DECREMENT_ITEM: {
        //     return {
        //         ...state,
        //         items: state.items.map(item =>
        //             item.id === action.payload
        //                 ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        //                 : item
        //         ),
        //     };
        // }
        const updatedItems = state.items.map(item =>
            item.id === action.payload
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
        );

        // Save updated items to localStorage
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));

        return {
            ...state,
            items: updatedItems,
        };
    }
case CLEAR_CART: {
    localStorage.removeItem('cartItems');
    return { ...state, items: [] };
}
        default:
            return state;
    }
};

export default cartReducer;
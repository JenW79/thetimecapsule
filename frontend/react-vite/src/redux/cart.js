const SET_CART = 'cart/setCart';
const ADD_CART_ITEM = 'cart/addItem';
const INCREMENT_ITEM = 'cart/incrementItem';
const REMOVE_CART_ITEM = 'cart/removeItem';
const DECREMENT_ITEM = 'cart/decrementItem';
const CLEAR_CART = 'cart/clearCart';

const initialState = {
    cartItems: []
};

export const setCart = (cartItems) => ({
    type: SET_CART,
    payload: cartItems
});

export const addCartItem = (item) => ({
    type: ADD_CART_ITEM,
    payload: item
});

export const incrementItem = (productId) => ({
    type: INCREMENT_ITEM,
    payload: productId
});

export const removeCartItem = (productId) => ({
    type: REMOVE_CART_ITEM,
    payload: productId
});

export const decrementItem = (productId) => ({
    type: DECREMENT_ITEM,
    payload: productId
});

export const clearCart = () => ({
    type: CLEAR_CART
});

export const fetchCart = () => async (dispatch, getState) => {
    const { session } = getState();

    if (session.user) {
        const response = await fetch('/api/cart');
        if (response.ok) {
            const data = await response.json();
            dispatch(setCart(data.cart_items));
        }
    } else {
        const storedCart = localStorage.getItem('guestCart');
        if (storedCart) {
            dispatch(setCart(JSON.parse(storedCart)));
        } else {
            dispatch(setCart([]));
        }
    }
};

export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
    const { session } = getState(); // Used getState here to get session

    if (session.user) {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: product.id,
                quantity
            })
        });

        if (response.ok) {
            dispatch(fetchCart());
        }
    } else {
        const cartItem = {
            product_id: product.id,
            name: product.name,
            quantity,
            price: product.price
        };

        dispatch(addCartItem(cartItem));

        const { cart } = getState(); // Get the updated cart state
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
    const { session } = getState(); // Used getState here to get session

    if (session.user) {
        const response = await fetch(`/api/cart/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            dispatch(fetchCart());
        }
    } else {
        dispatch(removeCartItem(productId));

        const { cart } = getState(); // Get the updated cart state
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

export const mergeCartsAfterLogin = () => async (dispatch) => {
    const storedCart = localStorage.getItem('guestCart');

    if (storedCart) {
        const guestCartItems = JSON.parse(storedCart);
        for (const item of guestCartItems) {
            await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    product_id: item.product_id,
                    quantity: item.quantity
                })
            });
        }

        localStorage.removeItem('guestCart');
        dispatch(fetchCart());
    }
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CART:
            return { ...state, cartItems: action.payload };

        case ADD_CART_ITEM: {
            const existingItemIndex = state.cartItems.findIndex(
                item => item.product_id === action.payload.product_id
            );

            if (existingItemIndex >= 0) {
                const updatedItems = [...state.cartItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
                };
                return { ...state, cartItems: updatedItems };
            } else {
                return { ...state, cartItems: [...state.cartItems, action.payload] };
            }
        }

        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.product_id !== action.payload)
            };

        case CLEAR_CART:
            return { ...state, cartItems: [] };

        case INCREMENT_ITEM: {
            const updatedItems = state.cartItems.map(item =>
                item.product_id === action.payload
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            return { ...state, cartItems: updatedItems };
        }

        case DECREMENT_ITEM: {
            const updatedItems = state.cartItems.map(item =>
                item.product_id === action.payload
                    ? {
                        ...item,
                        quantity: item.quantity > 1 ? item.quantity - 1 : 0
                    }
                    : item
            );
            const updatedCartItems = updatedItems.filter(item => item.quantity > 0);

            return { ...state, cartItems: updatedCartItems };
        }

        default:
            return state;
    }
};

export default cartReducer;
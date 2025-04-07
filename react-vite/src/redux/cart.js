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

    try {
        if (session.user) {
            const response = await fetch('/api/cart');
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                console.error("Received HTML instead of JSON. User might need to log in.");
                dispatch(setCart([]));
                return;
            }
            
            if (!response.ok) {
                console.error("Failed to fetch cart:", response.statusText);
                dispatch(setCart([]));
                return;
            }
            
            const data = await response.json();
            dispatch(setCart(data.cart_items || []));
        } else {
            const storedCart = localStorage.getItem('guestCart');
            if (storedCart) {
                dispatch(setCart(JSON.parse(storedCart)));
            } else {
                dispatch(setCart([]));
            }
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        dispatch(setCart([]));
    }
};

export const addToCart = (product, quantity = 1) => async (dispatch, getState) => {
    const { session } = getState();

    if (session.user) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: product.id,
                    quantity
                })
            });

            if (response.status === 405) {
                console.error("Method not allowed. The server doesn't support POST for /api/cart");
                const cartItem = {
                    product_id: product.id,
                    name: product.name,
                    quantity,
                    price: product.price,
                    product: product
                };
                dispatch(addCartItem(cartItem));
                const { cart } = getState();
                localStorage.setItem('tempUserCart', JSON.stringify(cart.cartItems));
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                console.error("Received HTML instead of JSON. User might need to log in.");
                return;
            }

            if (!response.ok) {
                console.error("Failed to add item to cart:", response.statusText);
                return;
            }

            dispatch(fetchCart());
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    } else {
        const cartItem = {
            product_id: product.id,
            name: product.name,
            quantity,
            price: product.price,
            product: product
        };

        dispatch(addCartItem(cartItem));

        const { cart } = getState();
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

export const removeFromCart = (productId) => async (dispatch, getState) => {
    const { session } = getState();

    if (productId === 'all') {
        dispatch({ type: CLEAR_CART });
        
        if (session.user) {
            try {
                const { cart } = getState();
                if (cart.cartItems.length > 0) {
                    const promises = cart.cartItems
                        .filter(item => item.id)
                        .map(item => 
                            fetch(`/api/cart/${item.id}`, { method: 'DELETE' })
                        );
                    
                    await Promise.all(promises);
                }
            } catch (error) {
                console.error("Failed to clear cart:", error);
            }
        } else {
            localStorage.removeItem('guestCart');
        }
        return;
    }

    if (session.user) {
        dispatch(removeCartItem(productId));
        
        try {
            const { cart } = getState();
            const cartItem = cart.cartItems.find(item => item.product_id === productId);
            
            if (!cartItem || !cartItem.id) {
                console.error("Item not found in cart or missing ID");
                return;
            }
            
            const response = await fetch(`/api/cart/${cartItem.id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                console.error("Failed to remove item from cart");
                dispatch(fetchCart());
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
            dispatch(fetchCart());
        }
    } else {
        dispatch(removeCartItem(productId));
        const { cart } = getState();
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

export const mergeCartsAfterLogin = () => async (dispatch) => {
    const storedCart = localStorage.getItem('guestCart');
    
    if (storedCart) {
        const guestCartItems = JSON.parse(storedCart);
        
        if (guestCartItems.length === 0) {
            localStorage.removeItem('guestCart');
            return;
        }
        
        try {
            const testResponse = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: guestCartItems[0]?.product_id || 1,
                    quantity: 1
                })
            });
            
            if (testResponse.status === 405) {
                console.error("API doesn't support POST. Storing cart items locally.");
                dispatch(setCart(guestCartItems));
                localStorage.setItem('tempUserCart', JSON.stringify(guestCartItems));
                localStorage.removeItem('guestCart');
                return;
            }
            
            for (const item of guestCartItems) {
                if (!item.product_id) continue;
                
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        product_id: item.product_id,
                        quantity: item.quantity
                    })
                });
            }
            
            localStorage.removeItem('guestCart');
            dispatch(fetchCart());
        } catch (error) {
            console.error("Error merging carts after login:", error);
        }
    }
};

export const incrementCartItem = (productId) => async (dispatch, getState) => {
    const { session } = getState();
    const { cart } = getState();
    const item = cart.cartItems.find(item => item.product_id === productId);
    
    if (!item) return;
    
    dispatch(incrementItem(productId));
    
    if (session.user) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: item.quantity + 1,
                    update_mode: true
                })
            });
            
            if (!response.ok) {
                console.error("Failed to increment item quantity");
                dispatch(fetchCart());
            }
        } catch (error) {
            console.error("Error incrementing item:", error);
            dispatch(fetchCart());
        }
    } else {
        const { cart } = getState();
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

export const decrementCartItem = (productId) => async (dispatch, getState) => {
    const { session } = getState();
    const { cart } = getState();
    const item = cart.cartItems.find(item => item.product_id === productId);
    
    if (!item) return;
    
    if (item.quantity === 1) {
        dispatch(removeFromCart(productId));
        return;
    }
    
    dispatch(decrementItem(productId));
    
    if (session.user) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: item.quantity - 1,
                    update_mode: true
                })
            });
            
            if (!response.ok) {
                console.error("Failed to decrement item quantity");
                dispatch(fetchCart());
            }
        } catch (error) {
            console.error("Error decrementing item:", error);
            dispatch(fetchCart());
        }
    } else {
        const { cart } = getState();
        localStorage.setItem('guestCart', JSON.stringify(cart.cartItems));
    }
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CART:
            return { ...state, cartItems: Array.isArray(action.payload) ? action.payload : [] };

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
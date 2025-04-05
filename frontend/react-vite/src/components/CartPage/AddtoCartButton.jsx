// import { useDispatch } from 'react-redux';
// import { addToCart } from '../../redux/cart';

// const AddtoCartButton = ({ item }) => {
//     const dispatch = useDispatch();

//     const handleAdd = async () => {
//         dispatch(addToCart(item));
//     };

//     return (
//         <button onClick={handleAdd}>
//             Add to Cart
//         </button>
//     );
// }

// export default AddtoCartButton;




// redux/cart.js

export const addToCart = (item) => {
    return async (dispatch) => {
        try {
            // Call your API to add the item to the cart
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            
            if (response.ok) {
                const data = await response.json();
                dispatch({
                    type: 'ADD_TO_CART',
                    payload: data,
                });
            } else {
                console.error('Error adding to cart');
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };
};

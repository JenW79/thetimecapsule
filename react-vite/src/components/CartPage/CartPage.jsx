import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, incrementItem, decrementItem } from '../../redux/cart';
import { useEffect, useState, useRef } from 'react';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const prevCartItemsRef = useRef();
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);

  // Hardcoded product list for adding to the cart
  const availableProducts = [
    { id: '1', name: 'Product 1', price: 20 },
    { id: '2', name: 'Product 2', price: 35 },
    { id: '3', name: 'Product 3', price: 50 },
  ];

  const handleIncrement = (productId) => {
    dispatch(incrementItem(productId));
  };

  const handleDecrement = (productId) => {
    dispatch(decrementItem(productId));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleClearCart = () => {
    dispatch(removeFromCart('all'));
  };

  useEffect(() => {
    if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
      prevCartItemsRef.current = cartItems;
      // Simulate error handling for cart fetch or calculation
      try {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total.toFixed(2));
      } catch (err) {
        console.error('Error calculating total price:', err);
        setError('Failed to calculate total price');
      }
    }
  }, [cartItems]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div>
      <h2>Your Cart</h2>
      {!cartItems || cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <br />
              <button onClick={() => handleIncrement(item.product_id)} className="your-cart-button">+</button>
              <button onClick={() => handleDecrement(item.product_id)} className="your-cart-button">-</button>
              <button onClick={() => handleRemoveFromCart(item.id)} className="your-cart-button">Remove from cart</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total Price: ${totalPrice}</h3>

      <div>
        <h3>Add New Item to Cart</h3>
        {availableProducts.map((product) => (
          <button key={product.id} onClick={() => handleAddToCart(product)} className="add-to-cart-button">
            Add {product.name} (${product.price})
          </button>
        ))}
      </div>

      <div>
        <button onClick={handleClearCart} className="clear-cart-button">
          Clear Cart
        </button>
      </div>
      <br />

      <div>
        <button onClick={handleProceedToCheckout} className="proceed-to-checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
// **note: use the code above since product routes isn't added yet






// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// // import { addToCart, removeFromCart, incrementItem, decrementItem, mergeCartsAfterLogin, fetchCart  } from '../../redux/cart';
// import { addToCart, removeFromCart, incrementItem, decrementItem  } from '../../redux/cart';
// import { useEffect, useState, useRef } from 'react';
// import './CartPage.css';

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.cartItems || []);
//   const prevCartItemsRef = useRef();
//   const navigate = useNavigate();

//   const [totalPrice, setTotalPrice] = useState(0);
//   const [error, setError] = useState(null);
//   const [availableProducts, setAvailableProducts] = useState([]);

//   useEffect(() => {
//     fetch('/api/products')
//       .then((response) => response.json())
//       .then((data) => setAvailableProducts(data))
//       .catch((error) => {
//         console.error('Error fetching products:', error);
//         setError('Failed to load products');
//       });
//   }, []);

//   const handleIncrement = (productId) => {
//     dispatch(incrementItem(productId));
//   };

//   const handleDecrement = (productId) => {
//     dispatch(decrementItem(productId));
//   };

//   const handleRemoveFromCart = (productId) => {
//     dispatch(removeFromCart(productId));
//   };

//   const handleAddToCart = (product) => {
//     dispatch(addToCart(product));
//   };

//   const handleClearCart = () => {
//     dispatch(removeFromCart('all'));
//   };

//   useEffect(() => {
//     if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
//       prevCartItemsRef.current = cartItems;
//       try {
//         const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         setTotalPrice(total);
//       } catch (err) {
//         console.error('Error calculating total price:', err);
//         setError('Failed to calculate total price');
//       }
//     }
//   }, [cartItems]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   const handleProceedToCheckout = () => {
//     navigate('/checkout');
//   };

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {!cartItems || cartItems.length === 0 ? (
//         <p>Your cart is empty!</p>
//       ) : (
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item.id}>
//               {item.name} - ${item.price} - Quantity: {item.quantity}
//               <br />
//               <button onClick={() => handleIncrement(item.product_id)} className="your-cart-button">+</button>
//               <button onClick={() => handleDecrement(item.product_id)} className="your-cart-button">-</button>
//               <button onClick={() => handleRemoveFromCart(item.id)} className="your-cart-button">Remove from cart</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h3>Total Price: ${totalPrice}</h3>

//       <div>
//         <h3>Add New Item to Cart</h3>
//         {availableProducts.length > 0 ? (
//           <select onChange={(e) => handleAddToCart(availableProducts[e.target.selectedIndex])}>
//             <option>Select a product</option>
//             {availableProducts.map((product) => (
//               <option key={product.id} value={product.id}>
//                 {product.name} - ${product.price}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <p>Loading available products...</p>
//         )}
//       </div>

//       <div>
//         <button onClick={handleProceedToCheckout} className="proceed-to-checkout-button">
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;





// **note: uncomment the code below after product routes is added
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { addToCart, removeFromCart, incrementItem, decrementItem, mergeCartsAfterLogin } from '../../redux/cart';
// import { useEffect, useState, useRef } from 'react';
// import './CartPage.css';

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.cartItems || []);
//   const prevCartItemsRef = useRef();
//   const navigate = useNavigate();

//   const [totalPrice, setTotalPrice] = useState(0);
//   const [error, setError] = useState(null);

//   const [availableProducts, setAvailableProducts] = useState([]);

//   useEffect(() => {
//     fetch('/api/products')
//       .then((response) => response.json())
//       .then((data) => setAvailableProducts(data))
//       .catch((error) => {
//         console.error('Error fetching products:', error);
//         setError('Failed to load products');
//       });
//   }, []);

//   const user = useSelector((state) => state.session.user);
//   useEffect(() => {
//     if (user) {
//       dispatch(mergeCartsAfterLogin());
//     }
//   }, [dispatch, user]);

//   const handleIncrement = (productId) => {
//     dispatch(incrementItem(productId));
//   };

//   const handleDecrement = (productId) => {
//     dispatch(decrementItem(productId));
//   };

//   const handleRemoveFromCart = (productId) => {
//     dispatch(removeFromCart(productId));
//   };

//   const handleAddToCart = (product) => {
//     dispatch(addToCart(product));
//   };

//   useEffect(() => {
//     if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
//       prevCartItemsRef.current = cartItems;
//       try {
//         const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//         setTotalPrice(total.toFixed(2)); 
//       } catch (err) {
//         console.error('Error calculating total price:', err);
//         setError('Failed to calculate total price');
//       }
//     }
//   }, [cartItems]);

//   if (error) {
//     return <div>{error}</div>;
//   }

//   const handleProceedToCheckout = () => {
//     navigate('/checkout');
//   };

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {!cartItems || cartItems.length === 0 ? (
//         <p>Your cart is empty!</p>
//       ) : (
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item.id}>
//               {item.name} - ${item.price} - Quantity: {item.quantity}
//               <br />
//               <button onClick={() => handleIncrement(item.product_id)} className="your-cart-button">+</button>
//               <button onClick={() => handleDecrement(item.product_id)} className="your-cart-button">-</button>
//               <button onClick={() => handleRemoveFromCart(item.id)} className="your-cart-button">Remove from cart</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h3>Total Price: ${totalPrice}</h3>

//       <div>
//         <h3>Add New Item to Cart</h3>
//         {availableProducts.length > 0 ? (
//           <select onChange={(e) => handleAddToCart(availableProducts[e.target.selectedIndex])}>
//             <option>Select a product</option>
//             {availableProducts.map((product) => (
//               <option key={product.id} value={product.id}>
//                 {product.name} - ${product.price}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <p>Loading available products...</p>
//         )}
//       </div>

//       <div>
//         <button onClick={handleProceedToCheckout} className="proceed-to-checkout-button">
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CartPage;
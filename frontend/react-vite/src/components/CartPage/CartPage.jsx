// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart, removeFromCart, incrementItem, decrementItem } from '../../redux/cart';
// import { useEffect, useState } from 'react';
// import './CartPage.css';

// const CartPage = () => {
//   const dispatch = useDispatch();
//   const cartItems = useSelector((state) => state.cart.items);

//   const [totalPrice, setTotalPrice] = useState(0);
//   const [error, setError] = useState(null);

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
//     fetch('/api/checkout')
//       .then(response => response.json())
//       .then(data => {
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setTotalPrice(data.total_price);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching cart details:', error);
//         setError('An error occurred while fetching the cart details.');
//       });
//   }, [cartItems]);
//   if (error) {
//     return <div>{error}</div>
//   }

//   return (
//     <div>
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty!</p>
//       ) : (
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item.id}>
//               {item.name} - ${item.price} - Quantity:{item.quantity}
//               <br />
//               <button onClick={() => handleIncrement(item.id)} className="button-spacing">+</button>
//               <button onClick={() => handleDecrement(item.id)} className="button-spacing">-</button>
//               <button onClick={() => handleRemoveFromCart(item.id)} className="button-spacing">Remove</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h3>Total Price: ${totalPrice}</h3>

//       <div>
//         <h3>Add New Item to Cart</h3>
//         <button onClick={() => handleAddToCart({ id: 'example-id', name: 'New Product', price: 100 })}>
//           Add New Product
//         </button>
//       </div>

//       <div>
//         <button onClick={() => alert('Proceeding to checkout...')}>
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };



// export default CartPage;





import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, incrementItem, decrementItem, clearCart } from '../../redux/cart';
import { useEffect, useState } from 'react';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items || []);
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
    dispatch(clearCart());
  };

  useEffect(() => {
    //   // Calculate the total price whenever the cart items change
    //   const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    //   setTotalPrice(total);
    // }, [cartItems]);
    // Simulate error handling for cart fetch or calculation
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotalPrice(total);
    } catch (err) {
      console.error('Error calculating total price:', err);
      setError('Failed to calculate total price');
    }
  }, [cartItems]);

  if (error) {
    return <div>{error}</div>
  }

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  }

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
              <button onClick={() => handleIncrement(item.id)} className="your-cart-button">+</button>
              <button onClick={() => handleDecrement(item.id)} className="your-cart-button">-</button>
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

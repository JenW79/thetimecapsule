import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  incrementItem,
  decrementItem,
  clearCart,
  fetchCart,
} from '../../redux/cart';
import { useNavigate } from 'react-router-dom';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const prevCartItemsRef = useRef();
  const navigate = useNavigate();

  const sessionUser = useSelector((state) => state.session.user);

  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const signupModalRef = useRef(null);
  const loginModalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const clickedScrollbar = e.clientX >= document.documentElement.clientWidth;

      if (!clickedScrollbar) {
        if (
          showSignupModal &&
          signupModalRef.current &&
          !signupModalRef.current.contains(e.target)
        ) {
          setShowSignupModal(false);
        }

        if (
          showLoginModal &&
          loginModalRef.current &&
          !loginModalRef.current.contains(e.target)
        ) {
          setShowLoginModal(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showSignupModal, showLoginModal]);

  const handleIncrement = (productId) => {
    dispatch(incrementItem(productId));
  };

  const handleDecrement = (productId) => {
    dispatch(decrementItem(productId));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
      prevCartItemsRef.current = cartItems;
      try {
        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total.toFixed(2));
      } catch (err) {
        setError('Failed to calculate total price');
      }
    }
  }, [cartItems]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleProceedToCheckout = () => {
    if (!sessionUser) {
      setShowSignupModal(true);
      return;
    }
    navigate('/checkout');
  };

  return (
    <div>
      <h2>cart</h2>
      {!cartItems || cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <p>Add some products to get started.</p>
        </div>
      ) : (
        <div>
          <div>
            {cartItems.map((item) => (
              <div key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>price: ${item.price}</p>
                  <p>quantity: {item.quantity}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleDecrement(item.id)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <div className="item-subtotal">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  aria-label="Remove item"
                >
                  remove
                </button>
              </div>
            ))}
          </div>
          <div>
            <div>
              <h3>total: ${totalPrice}</h3>
            </div>
            <div>
              <button onClick={handleClearCart}>clear cart</button>
              <button onClick={handleProceedToCheckout}>continue to checkout</button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div ref={loginModalRef}>
          <LoginFormModal onClose={() => setShowLoginModal(false)} />
        </div>
      )}
      {showSignupModal && (
        <div ref={signupModalRef}>
          <SignupFormModal onClose={() => setShowSignupModal(false)} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
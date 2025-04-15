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
  const cartItems = useSelector((state) => Array.isArray(state.cart.cartItems) ? state.cart.cartItems : []);
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

  useEffect(() => {
    if (Array.isArray(cartItems) && JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
      prevCartItemsRef.current = cartItems;
      try {
        const total = cartItems.reduce((sum, item) => {
          const price = parseFloat(item.product?.price) || 0;
          const quantity = item.quantity || 0;
          return sum + price * quantity;
        }, 0);
        setTotalPrice(total);
      } catch (err) {
        setError('Failed to calculate total price');
      }
    }
  }, [cartItems]);

  const handleIncrement = (productId) => dispatch(incrementItem(productId));
  const handleDecrement = (productId) => dispatch(decrementItem(productId));
  const handleRemoveFromCart = (productId) => dispatch(removeFromCart(productId));
  const handleClearCart = () => dispatch(clearCart());

  const handleProceedToCheckout = () => {
    if (!sessionUser) {
      setShowSignupModal(true);
      return;
    }
    navigate('/checkout');
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Cart</h2>
      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <p>Add some products to get started.</p>
        </div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {(() => {
                  let imageUrls = [];

                  if (Array.isArray(item.product?.image_url)) {
                    imageUrls = item.product.image_url;
                  } else if (typeof item.product?.image_url === "string") {
                    try {
                      const parsed = JSON.parse(item.product.image_url);
                      imageUrls = Array.isArray(parsed) ? parsed : [parsed];
                    } catch {
                      imageUrls = [item.product.image_url];
                    }
                  }

                  return imageUrls.length ? (
                    <div>
                      {imageUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${item.product?.name} ${idx + 1}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div>No Image</div>
                  );
                })()}
              </div>
              <div className="cart-item-details">
                <h3>{item.product?.name}</h3>
                <p>
                  price: $
                  {item.product?.price !== undefined
                    ? parseFloat(item.product.price).toFixed(2)
                    : 'N/A'}
                </p>
                <div>
                  <span>qty: {item.quantity}</span>
                  <br />
                  <button onClick={() => handleDecrement(item.id)} aria-label="Decrease quantity">-</button>
                  <button onClick={() => handleIncrement(item.id)} aria-label="Increase quantity">+</button>
                </div>
                <div className="item-subtotal">
                  <p>
                    subtotal: $
                    {item.product?.price !== undefined
                      ? (item.product.price * item.quantity).toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)} aria-label="Remove item">remove</button>
              </div>
            </div>
          ))}

          <div>
            <h3>total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleClearCart}>clear cart</button>
            <button onClick={handleProceedToCheckout}>proceed to checkout</button>
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
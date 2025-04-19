import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import greenSprinkles from '../../assets/sprinkle-green.png';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.cartItems) ? state.cart.cartItems : []
  );
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const [error] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const signupModalRef = useRef(null);
  const loginModalRef = useRef(null);

  const handleIncrement = useCallback(
    (productId) => dispatch(incrementItem(Number(productId))),
    [dispatch]
  );

  const handleDecrement = useCallback(
    (productId) => dispatch(decrementItem(Number(productId))),
    [dispatch]
  );

  const handleRemoveFromCart = useCallback(
    (productId) => dispatch(removeFromCart(Number(productId))),
    [dispatch]
  );

  const handleClearCart = () => dispatch(clearCart());

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

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showSignupModal, showLoginModal]);

  const total = useMemo(() => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  }, [cartItems]);

  const memoizedCartItems = useMemo(() => {
    return cartItems.map((item) => {
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

      return (
        <div key={item.id} className="cart-item-container">
          <div className="cart-item-image">
            {imageUrls.length ? (
              imageUrls.map((url, idx) => (
                <div className="cart-image-wrapper" key={idx}>
                  <img
                    src={greenSprinkles}
                    alt="Green Sprinkles"
                    className="sprinkle-bg sprinkle-green"
                  />
                  <img
                    src={url || "/placeholder-image.jpg"}
                    alt={item.product?.name || "Product"}
                    className="product-image"
                  />
                </div>
              ))
            ) : (
              <div>No Image</div>
            )}
          </div>
          <div className="cart-item-details">
            <p>{item.product?.name}</p>
            <p>
              price: $
              {item.product?.price
                ? parseFloat(item.product.price).toFixed(2)
                : "N/A"}
            </p>
            <div>
              <p>qty: {item.quantity}</p>
              <br />
              <button onClick={() => handleDecrement(item.id)} aria-label="Decrease quantity">
                -
              </button>
              <button onClick={() => handleIncrement(item.id)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <div className="item-subtotal">
              <p>
                subtotal: $
                {item.product?.price && item.quantity
                  ? (item.product.price * item.quantity).toFixed(2)
                  : "N/A"}
              </p>
            </div>
            <button onClick={() => handleRemoveFromCart(item.id)} aria-label="Remove item">
              remove
            </button>
          </div>
        </div>
      );
    });
  }, [cartItems, handleDecrement, handleIncrement, handleRemoveFromCart]);

  const handleProceedToCheckout = () => {
    if (!sessionUser) {
      setShowSignupModal(true);
      return;
    }
    navigate("/checkout");
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>cart</h1>
      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty!</p>
          <p>Add some products to get started.</p>
        </div>
      ) : (
        <div className="cart-items-grid">
          {memoizedCartItems}
          <div>
            <h3>total: ${total}</h3>
            <h1>i want it all</h1>
            <button onClick={handleClearCart}>clear cart</button>
            <button onClick={handleProceedToCheckout}>continue to checkout</button>
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
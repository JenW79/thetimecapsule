import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, incrementItem, decrementItem, clearCart, fetchCart } from '../../redux/cart';
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

  // const availableProducts = [
  //   { id: '1', name: 'Cabbage Patch Kids', description: 'Popular soft-bodied dolls with adoption papers, a cultural phenomenon of the 1980s', price: 49.99, image_url: 'https://example.com/cabbage-patch-kids.jpg', decade: '80s', category: 'toy' },
  //   { id: '2', name: 'Pac-Man', description: 'Iconic arcade game where players navigate a yellow character through a maze eating dots and avoiding ghosts', price: 29.99, image_url: 'https://example.com/pacman.jpg', decade: '80s', category: 'game' },
  //   { id: '3', name: 'Nintendo Entertainment System (NES)', description: '8-bit home video game console that revitalized the video game industry in the 1980s', price: 199.99, image_url: 'https://example.com/nes.jpg', decade: '80s', category: 'electronic' },
  //   { id: '4', name: 'Beanie Babies', description: 'Small stuffed animals filled with plastic pellets, creating a collecting craze in the 1990s', price: 9.99, image_url: 'https://example.com/beanie-babies.jpg', decade: '90s', category: 'toy' },
  //   { id: '5', name: 'Pokemon', description: 'Japanese media franchise centered on fictional creatures called Pokemon, with games, trading cards, and more', price: 39.99, image_url: 'https://example.com/pokemon.jpg', decade: '90s', category: 'game' },
  //   { id: '6', name: 'Cassettes', description: 'Analog magnetic tape recording format for audio recording and playback, popular in the 1990s', price: 14.99, image_url: 'https://example.com/cassettes.jpg', decade: '90s', category: 'electronic' },
  //   { id: '7', name: 'Bratz', description: 'Fashion dolls characterized by their large heads and stylized features, popular in the 2000s', price: 24.99, image_url: 'https://example.com/bratz.jpg', decade: '00s', category: 'toy' },
  //   { id: '8', name: 'Call of Duty', description: 'First-person shooter video game franchise that began in 2003, known for its realistic warfare gameplay', price: 59.99, image_url: 'https://example.com/call-of-duty.jpg', decade: '00s', category: 'game' },
  //   { id: '9', name: 'iPod', description: 'Portable media player designed and marketed by Apple Inc., revolutionary in the 2000s music scene', price: 299.99, image_url: 'https://example.com/ipod.jpg', decade: '00s', category: 'electronic' },
  // ];

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
    dispatch(fetchCart());
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    fetch('/api/cart', { method: 'DELETE' }).then(() => {
      dispatch(fetchCart());
    });
  };

  useEffect(() => {
    if (JSON.stringify(prevCartItemsRef.current) !== JSON.stringify(cartItems)) {
      prevCartItemsRef.current = cartItems;
      try {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>price: ${item.price}</p>
                  <p>quantity: {item.quantity}</p>
                </div>
                <div>
                  <button onClick={() => handleDecrement(item.id)} aria-label="Decrease quantity">-</button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.id)} aria-label="Increase quantity">+</button>
                </div>
                <div className="item-subtotal">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => handleRemoveFromCart(item.id)} aria-label="Remove item">remove</button>
              </li>
            ))}
          </ul>
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
      <div className="available-products">
        <h3>Add New Item to Cart</h3>
        <div>
          {availableProducts.map((product) => (
            <div key={product.id}>
              <h4>{product.name}</h4>
              <p>${product.price}</p>
              <button onClick={() => handleAddToCart(product)}>add to cart</button>
            </div>
          ))}
        </div>
      </div>
      {showLoginModal && <div ref={loginModalRef}><LoginFormModal onClose={() => setShowLoginModal(false)} /></div>}
      {showSignupModal && <div ref={signupModalRef}><SignupFormModal onClose={() => setShowSignupModal(false)} /></div>}
    </div>
  );
};

export default CartPage;
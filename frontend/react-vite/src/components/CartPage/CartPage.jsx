import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, incrementItem, decrementItem } from '../../redux/cart';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

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

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity:{item.quantity}
              <br></br>
              <button onClick={() => handleIncrement(item.id)} className="button-spacing">+</button>
              <button onClick={() => handleDecrement(item.id)} className="button-spacing">-</button>
              <button onClick={() => handleRemoveFromCart(item.id)} className="button-spacing">Remove</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Add New Item to Cart</h3>
        <button onClick={() => handleAddToCart({ id: 'example-id', name: 'New Product', price: 100 })}>
          Add New Product
        </button>
      </div>
    </div>
  );
};



export default CartPage;
import { NavLink } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";
import { useSelector } from "react-redux";
import './CartIcon.css';

function CartIcon() {
    const cartCount = useSelector((state) =>
        state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)
    );

    return (
        <NavLink to="/cart" className="cart-link">
            <div className="cart-wrapper">
                <FaShoppingBag size={24} />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
        </NavLink>
    );
}

export default CartIcon;
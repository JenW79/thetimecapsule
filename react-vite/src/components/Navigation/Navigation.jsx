import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { FaShoppingBag } from "react-icons/fa";

function Navigation() {
  const cartCount = useSelector((state) =>
    state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <div className="navbar">
      <div className="logo-container">
        <img
          src="/the-time-capsule-logo.png"
          alt="The Time Capsule Logo"
          className="logo"
        />
      </div>

      <div className="nav-link">
        <NavLink to="/" className="home-button">
          <button>home</button>
        </NavLink>
      </div>
      <div className="nav-link">
        <NavLink to="/products" className="decade-button">
          <button>all nostaglia</button>
        </NavLink>
      </div>
      <div className="nav-link">
        <NavLink to="/products?decade=80s" className="decade-button">
          <button>80s</button>
        </NavLink>
      </div>
      <div className="nav-link">
        <NavLink to="/products?decade=90s" className="decade-button">
          <button>90s</button>
        </NavLink>
      </div>
      <div className="nav-link">
        <NavLink to="/products?decade=00s" className="decade-button">
          <button>00s</button>
        </NavLink>
      </div>
      <div className="nav-link cart-container">
        <NavLink to="/cart" className="cart-link">
          <div className="cart-wrapper">
            <FaShoppingBag size={24} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </NavLink>
      </div>

      <div className="profile-button">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
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
      <div className="navigation-links">
        <div className="nav-link">
          <NavLink to="/" className="home-button">
            <button className="button-style">Home</button>
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/decades" className="decades-button">
            <button className="button-style">Decades</button>
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/toys" className="toys-button">
            <button className="button-style">Toys</button>
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/games" className="games-button">
            <button className="button-style">Games</button>
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/electronics" className="electronics-button">
            <button className="button-style">Electronics</button>
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
    </div>
  );
}

export default Navigation;
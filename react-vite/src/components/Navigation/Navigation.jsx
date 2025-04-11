import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
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
        <div className="profile-button">
          <ProfileButton />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
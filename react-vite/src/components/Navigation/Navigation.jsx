import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import homeButtonImage from '../../assets/the-time-capsule-home-button.png'
import decadesButtonImage from '../../assets/the-time-capsule-decades-button.png';
import toysButtonImage from '../../assets/the-time-capsule-toys-button.png';
import gamesButtonImage from '../../assets/the-time-capsule-games-button.png';
import electronicsButtonImage from '../../assets/the-time-capsule-electronics-button.png';

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
            <img src={homeButtonImage} alt="Home Button" />
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/decades" className="decades-button">
            <img src={decadesButtonImage} alt="Decades Button" />
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/toys" className="toys-button">
            <img src={toysButtonImage} alt="Toys Button" />
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/games" className="games-button">
            <img src={gamesButtonImage} alt="Games Button" />
          </NavLink>
        </div>
        <div className="nav-link">
          <NavLink to="/electronics" className="electronics-button">
            <img src={electronicsButtonImage} alt="Electronics Button" />
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
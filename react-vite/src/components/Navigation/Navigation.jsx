import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import buttonImage from '../../assets/the-time-capsule-buttons.png';

function Navigation() {
  return (
    <div className="navigation">
      <div className="nav-link">
        <NavLink to="/">Home</NavLink>
      </div>
      <div>
      <div className="image-button">
        <img src={buttonImage} alt="Button" />
      </div>
      </div>
      <div className="profile-button">
        <ProfileButton />
      </div>
    </div>
  );
}

export default Navigation;
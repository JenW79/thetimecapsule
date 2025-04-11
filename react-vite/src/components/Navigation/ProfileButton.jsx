
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import AuthModal from "../AuthModal/AuthModal";
import profileIcon from '../../assets/the-time-capsule-profile-button.png';
import { useModal } from "../../context/Modal";

function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const { setModalContent } = useModal();

  const toggleMenu = (e) => {
    e.stopPropagation();
  
    if (!user) {
      setModalContent(<AuthModal />);
      return;
    }
  
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <img src={profileIcon} alt="Profile" className="profile-icon" />
      </button>
      {showMenu && user && (
  <ul className="profile-dropdown" ref={ulRef}>
    <li>{user.username}</li>
    <li>{user.email}</li>
    <li>
      <button onClick={logout}>Log Out</button>
    </li>
  </ul>
)}

    </>
  );
}

export default ProfileButton;
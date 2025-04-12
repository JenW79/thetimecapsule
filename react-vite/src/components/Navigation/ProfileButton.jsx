
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import AuthModal from "../AuthModal/AuthModal";
import profileIcon from '../../assets/the-time-capsule-profile-button.png';
import { useModal } from "../../context/Modal";
import UserDropdown from "../Navigation/UserDropdown"; 

function ProfileButton() {
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

  return (
    <>
      <button className="profile-button" onClick={toggleMenu}>
        <img src={profileIcon} alt="Profile" className="profile-icon" />
      </button>
      {showMenu && user && (
  <div ref={ulRef}>
    <UserDropdown user={user} closeMenu={closeMenu} />
  </div>
)}

    </>
  );
}

export default ProfileButton;
import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session"
import { FiUser, FiClipboard, FiMail, FiGift, FiSettings, FiLogOut, FiCreditCard, FiTag } from "react-icons/fi";

import './UserDropDown.css'

export default function UserDropDown( { user, closeMenu }) {
    const dispatch = useDispatch()

    const logout = (e) => {
        e.preventDefault();
        dispatch(thunkLogout());
        if (closeMenu) closeMenu();
      };
      
    return (
        <div className="user-dropdown">
        <div className="user-dropdown-header">
        <FiUser className="user-avatar-icon" />
          {/* <img className="user-avatar" src="/default-avatar.png" alt="User" /> */}
          <div>
            <strong className="user-name">{user.username}</strong>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
  
        <div className="user-dropdown-section">
          <div className="user-dropdown-item"><FiClipboard className="dropdown-icon" />Purchases and reviews</div>
          <div className="user-dropdown-item"> <FiMail className="dropdown-icon" />Messages(coming soon)</div>
          <div className="user-dropdown-item"><FiCreditCard className="dropdown-icon" />Credit balance: $0.00(coming soon)</div>
          <div className="user-dropdown-item"><FiTag className="dropdown-icon" />Special offers(coming soon)</div>
          <div className="user-dropdown-item"><FiGift className="dropdown-icon" />Registry(coming soon)</div>
        </div>
  
        <div className="user-dropdown-section">
          <div className="user-dropdown-item"><FiSettings className="dropdown-icon" />Account settings(coming soon)</div>
          <div className="user-dropdown-item" onClick={logout}><FiLogOut className="dropdown-icon" />Sign out</div>
        </div>
      </div>
    )
}
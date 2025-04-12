import { useDispatch } from "react-redux";
import { thunkLogout } from "../../redux/session"
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
          <img className="user-avatar" src="/default-avatar.png" alt="User" />
          <div>
            <strong>{user.username}</strong>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
  
        <div className="user-dropdown-section">
          <div className="user-dropdown-item">Purchases and reviews</div>
          <div className="user-dropdown-item">Messages(coming soon)</div>
          <div className="user-dropdown-item">Credit balance: $0.00(coming soon)</div>
          <div className="user-dropdown-item">Special offers(coming soon)</div>
          <div className="user-dropdown-item">Registry(coming soon)</div>
        </div>
  
        <div className="user-dropdown-section">
          <div className="user-dropdown-item">Account settings(coming soon)</div>
          <div className="user-dropdown-item" onClick={logout}>Sign out</div>
        </div>
      </div>
    )
}
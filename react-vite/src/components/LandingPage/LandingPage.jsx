import { NavLink } from "react-router-dom";
import './LandingPage.css';
import gridBackground from '../../assets/background-grid.png';
import crescent from '../../assets/crescent.png';
import rectangle from '../../assets/rectangle.png';
import triangle from '../../assets/triangle.png';

function LandingPage() {
    return (
        <div className="landing-page">
            <h1 className="landing-title">Welcome to The Time Capsule!</h1>
            <img src={gridBackground} alt="Background Grid" className="background-grid" />
            <div className="shape-row">
                <img src={crescent} alt="Crescent" className="shape" />
                <img src={rectangle} alt="Rectangle" className="shape" />
                <img src={triangle} alt="Triangle" className="shape" />
            </div>
            <div className="nav-link">
                <NavLink to="/products" className="shop-now-button">
                    <button className="button-style">shop now</button>
                </NavLink>
            </div>
        </div>
    );
}


export default LandingPage;
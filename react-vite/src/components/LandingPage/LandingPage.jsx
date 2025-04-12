// import { NavLink } from "react-router-dom";
// import './LandingPage.css';
// import gridBackground from '../../assets/background-grid.png';
// import crescent from '../../assets/crescent.png';
// import rectangle from '../../assets/rectangle.png';
// import triangle from '../../assets/triangle.png';
// import eightiesImage from '../../product-images/nintendo.jpeg';
// import ninetiesImage from '../../product-images//yellow-pokemon-gameboy-game.png';
// import twoThousandsImage from '../../product-images/Apple-iPod-first-generation.jpg';
// // import sparkles from '../../assets/sprinkle-peri.png';

// function LandingPage() {
//     return (
//         <div>
//             <div>
//             <h1 className="we-got-it">we&apos;ve got it all</h1>
//             </div>
//             <div className="landing-page">
//                 <h1 className="landing-title">Welcome to The Time Capsule!</h1>
//                 <img src={gridBackground} alt="Background Grid" className="background-grid" />
//                 <div className="shape-row">
//                     <img src={crescent} alt="Crescent" className="shape" />
//                     <img src={rectangle} alt="Rectangle" className="shape" />
//                     <img src={triangle} alt="Triangle" className="shape" />
//                 </div>

//                 <div className="nostalgia-container">
//                     <div className="nostalgia-item">
//                         <img src={eightiesImage} alt="80s nostalgia" />
//                         <span>80s nostalgia</span>
//                         <NavLink to="/products" className="shop-now-button">
//                             <button>Shop Now</button>
//                         </NavLink>
//                     </div>
//                     <div className="nostalgia-item">
//                         <img src={ninetiesImage} alt="90s nostalgia" />
//                         <span>90s nostalgia</span>
//                         <NavLink to="/products" className="shop-now-button">
//                             <button>Shop Now</button>
//                         </NavLink>
//                     </div>
//                     <div className="nostalgia-item">
//                         <img src={twoThousandsImage} alt="00s nostalgia" />
//                         <span>00s nostalgia</span>
//                         <NavLink to="/products" className="shop-now-button">
//                             <button>Shop Now</button>
//                         </NavLink>
//                     </div>
//                 </div>

//                 <div className="top-rated-products">Top Rated Products
//                 </div>
//                 {/* <div className="sparkles-image"><img src={sparkles} alt="sparkles image" />
//                 </div> */}
//             </div>
//         </div>
//     );
// }

// export default LandingPage;






import { NavLink } from "react-router-dom";
import './LandingPage.css';
import crescent from '../../assets/crescent.png';
import rectangle from '../../assets/rectangle.png';
import triangle from '../../assets/triangle.png';
import eightiesImage from '../../product-images/nintendo.jpeg';
import ninetiesImage from '../../product-images/yellow-pokemon-gameboy-game.png';
import twoThousandsImage from '../../product-images/Apple-iPod-first-generation.jpg';

function LandingPage() {
    return (
        <div className="landing-wrapper">
            <div className="we-got-it-wrapper">
                <h1 className="we-got-it">we&apos;ve got it all</h1>
            </div>

            <div className="landing-page">
                <h1 className="landing-title">Welcome to The Time Capsule!</h1>

                <div className="shape-row">
                    <img src={crescent} alt="Crescent" className="shape" />
                    <img src={rectangle} alt="Rectangle" className="shape" />
                    <img src={triangle} alt="Triangle" className="shape" />
                </div>

                <div className="nostalgia-container">
                    <div className="nostalgia-item">
                        <img src={eightiesImage} alt="80s nostalgia" />
                        <span>80s nostalgia</span>
                        <NavLink to="/products" className="shop-now-button">
                            <button>Shop Now</button>
                        </NavLink>
                    </div>
                    <div className="nostalgia-item">
                        <img src={ninetiesImage} alt="90s nostalgia" />
                        <span>90s nostalgia</span>
                        <NavLink to="/products" className="shop-now-button">
                            <button>Shop Now</button>
                        </NavLink>
                    </div>
                    <div className="nostalgia-item">
                        <img src={twoThousandsImage} alt="00s nostalgia" />
                        <span>00s nostalgia</span>
                        <NavLink to="/products" className="shop-now-button">
                            <button>Shop Now</button>
                        </NavLink>
                    </div>
                </div>

                <div className="top-rated-products">Top Rated Products</div>
            </div>
        </div>
    );
}

export default LandingPage;
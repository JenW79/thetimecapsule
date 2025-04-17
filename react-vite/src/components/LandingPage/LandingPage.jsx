import { NavLink } from "react-router-dom";
import "./LandingPage.css";
import crescent from "../../assets/crescent.png";
import rectangle from "../../assets/rectangle.png";
import triangle from "../../assets/triangle.png";
import eightiesImage from "../../product-images/nintendo.jpg";
import ninetiesImage from "../../product-images/yellow-pokemon-gameboy-game.png";
import twoThousandsImage from "../../product-images/Apple-iPod-first-generation.jpg";
import topRatedImage1 from "../../product-images/red-blue-pokemon-gameboy-game.png";
import topRatedImage2 from "../../product-images/Pacman.jpg";
import topRatedImage3 from "../../product-images/gameboy-original-all-sides.jpg";
import periwinkleSprinkles from "../../assets/sprinkle-peri.png";
import bottomBackground from "../../assets/the-time-capsule-bottom-background.png";
import MouseSprinkles from "../MouseSprinkles";

function LandingPage() {
  return (
    <div className="landing-wrapper">
      <div className="we-got-it-wrapper">
        <h1 className="we-got-it">we&apos;ve got it all</h1>
      </div>

      <div className="landing-page">
        <h1 className="landing-title">Welcome to The Time Capsule!</h1>
        <MouseSprinkles /> 
        <div className="nostalgia-container">
          <div className="nostalgia-set">
            <img src={crescent} alt="Crescent" className="shape shape-crescent" />
            <img src={eightiesImage} className="circle-img" alt="80s nostalgia" />
            <div className="nostalgia-info-box">
              <div className="nostalgia-text-wrapper">
                <span>80s nostalgia</span>
                <NavLink to="/products?decade=80s" className="shop-now-button">
                  <button>Shop Now</button>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="nostalgia-set">
            <img src={rectangle} alt="Rectangle" className="shape shape-rectangle" />
            <img src={ninetiesImage} className="circle-img" alt="90s nostalgia" />
            <div className="nostalgia-info-box">
              <div className="nostalgia-text-wrapper">
                <span>90s nostalgia</span>
                <NavLink to="/products?decade=90s" className="shop-now-button">
                  <button>Shop Now</button>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="nostalgia-set">
            <img src={triangle} alt="Triangle" className="shape shape-triangle" />
            <img src={twoThousandsImage} className="circle-img" alt="00s nostalgia" />
            <div className="nostalgia-info-box">
              <div className="nostalgia-text-wrapper">
                <span>00s nostalgia</span>
                <NavLink to="/products?decade=00s" className="shop-now-button">
                  <button>Shop Now</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div className="top-rated-wrapper">
          <h1 className="top-rated-products">Top Rated Products</h1>

          <div className="top-rated-images-container">
            <div className="top-rated-item">
              <div className="top-rated-image-wrapper">
                <img src={periwinkleSprinkles} alt="Periwinkle Sprinkles" className="sprinkle-bg sprinkle-peri" />
                <img src={topRatedImage1} className="square-img" alt="top rated nostalgia 1" />
              </div>
              <span>red & blue pokemon gameboy games</span>
              <NavLink to="/products" className="shop-now-button">
                <button>Shop Now</button>
              </NavLink>
            </div>

            <div className="top-rated-item">
              <div className="top-rated-image-wrapper">
                <img src={periwinkleSprinkles} alt="Periwinkle Sprinkles" className="sprinkle-bg sprinkle-peri" />
                <img src={topRatedImage2} className="square-img" alt="top rated nostalgia 2" />
              </div>
              <span>Pac-Man</span>
              <NavLink to="/products" className="shop-now-button">
                <button>Shop Now</button>
              </NavLink>
            </div>

            <div className="top-rated-item">
              <div className="top-rated-image-wrapper">
                <img src={periwinkleSprinkles} alt="Periwinkle Sprinkles" className="sprinkle-bg sprinkle-peri" />
                <img src={topRatedImage3} className="square-img" alt="top rated nostalgia 3" />
              </div>
              <span>Gameboy Original</span>
              <NavLink to="/products" className="shop-now-button">
                <button>Shop Now</button>
              </NavLink>
            </div>
          </div>
        </div>
        <img src={bottomBackground} className="bottom-background" alt="bottom background" />
      </div>
    </div>
  );
}

export default LandingPage;

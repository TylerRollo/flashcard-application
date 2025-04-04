import { Link } from "react-router-dom";
import "../styles/components/Header.css";
import logo from "../assets/logo.jpg"; // Ensure you have a logo image in src/assets/

const Header = () => {
  return (
    <div className="header">
      <nav>
        {/* Logo on the Left */}
        <div className="logo"> 
          <Link to="/">
            <img src={logo} alt="FlashCard Learn Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/decks">Edit Decks</Link>
          </li>
          <li>
            <Link to="/playgame">Play Game</Link>
          </li>
          <li>
            <Link to="/fastadd">Fast Add</Link>
          </li>
        </ul>

        {/* Login / Sign Up on the Right */}
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link> 
        </div>
      </nav>
    </div>
  );
};

export default Header;

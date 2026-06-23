import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">RecipeHub</Link>
      </div>

      <div className="navbar__links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register" className="navbar__btn">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      setScrolled(currentScrollPos > 40);

      const isVisible = prevScrollPos.current > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      
      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={`navbar-container ${scrolled ? "scrolled" : ""} ${visible ? "" : "hidden"}`}>
      <div className="nav-left">
        <Link to="/dashboard" className="nav-link">Home</Link>
        <Link to="/internships" className="nav-link">Internships</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>

      <Link to={user ? "/dashboard" : "/"} className="nav-logo">
          College<span>Compass</span>
      </Link>

      <div className="nav-right">
       {user ? (
            <>
              <Link to="/profile" className="btn-outline">Profile</Link>
              <button className="btn-demo" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/" className="link-login">Sign in</Link>
              <Link to="/register" className="btn-demo">
                Get Started →
              </Link>
            </>
          )}
      </div>
    </nav>
  );
}
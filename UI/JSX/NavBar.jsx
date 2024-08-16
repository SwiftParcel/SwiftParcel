import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { useAuth } from '../Public/AuthContext';
import './navbar.css';
import logo from '../Images/logo-nav.png';
import TranslateWidget from './TranslateWidget.jsx';

const Navbar = () => {
  const [Mobile, setMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('loginId');
    logout();
    navigate('/');
  };

  return (
    <div className="nav-container">
      <nav className="navbar">
        <img className="logo" src={logo} alt="Logo" />
        <ul
          className={Mobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setMobile(false)}
        >
          {user ? (
            <>
              {/* Check if user type is User */}
              {user.user_type === 'User' ? (
                <>
                <li><TranslateWidget /></li>
                  <Link to="/" className="home">
                    <li>Home</li>
                  </Link>
                  <Link to="/quote" className="quote">
                    <li>Quote & Ship</li>
                  </Link>
                  <Link to="/aboutUs" className="support">
                    <li>About Us</li>
                  </Link>
                  <Link to="/contactUs" className="support">
                    <li>Contact Us</li>
                  </Link>
                </>
              ) : null}
              <li className="username">Welcome, {user.username}</li>
              <button className="signout-button" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <li><TranslateWidget /></li>
              <Link to="/" className="home">
                <li>Home</li>
              </Link>
              <Link to="/quote" className="quote">
                <li>Quote & Ship</li>
              </Link>
              <Link to="/aboutUs" className="support">
                <li>About Us</li>
              </Link>
              <Link to="/contactUs" className="support">
                <li>Contact Us</li>
              </Link>
              <Link to="/signin" className="signin">
                <button>Sign In</button>
              </Link>
            </>
          )}
        </ul>
        <button
          className="mobile-menu-icon"
          onClick={() => setMobile(!Mobile)}
        >
          {Mobile ? <ImCross /> : <FaBars />}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;

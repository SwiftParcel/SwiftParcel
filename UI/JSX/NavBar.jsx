import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import "./navbar.css";
import logo from '../Images/logo-nav.png';

import Home from "./Home.jsx";
import SignIn from "./app.jsx"

const Navbar = () => {
  const [Mobile, setMobile] = useState(false);

  return (
    <div className="nav-container">
      <nav className="navbar">
        <img className="logo" src={logo} alt="Logo" />
        <ul
          className={Mobile ? "nav-links-mobile" : "nav-links"}
          onClick={() => setMobile(false)}
        >
          <Link to="/" className="home">
            <li>Home</li>
          </Link>
          <Link to="/quote" className="quote">
            <li>Quote</li>
          </Link>
          <Link to="/ship" className="ship">
            <li>Ship</li>
          </Link>
          <Link to="/support" className="support">
            <li>Support</li>
          </Link>
          <Link to="/signinMenu" className="signin">
            
              <button>Sign In</button>
              
          </Link>
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

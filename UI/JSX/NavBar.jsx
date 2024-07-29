import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { useAuth } from '../Public/AuthContext';
import './navbar.css';
import logo from '../Images/logo-nav.png';

const Navbar = () => {
  const [Mobile, setMobile] = useState(false);
  const { user, logout } = useAuth();
  const [custName, setCustName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchUserDetails = async () => {
        const loginId = localStorage.getItem('loginId');
        if (!loginId) return;

        const query = `
          query getUserDetails($Id: ID!) {
            getUserDetails(Id: $Id) {
              Cust_name
            }
          }
        `;
        const variables = { Id: loginId };

        try {
          const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          });

          const result = await response.json();
          if (result.data && result.data.getUserDetails) {
            setCustName(result.data.getUserDetails.Cust_name);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [user]);

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
              <Link to="/" className="home">
                <li>Home</li>
              </Link>
              <Link to="/quote" className="quote">
                <li>Quote</li>
              </Link>
              <Link to="/ship" className="ship">
                <li>Ship</li>
              </Link>
              <Link to="/aboutUs" className="support">
                <li>About Us</li>
              </Link>
              <Link to="/contactUs" className="support">
                <li>Contact Us</li>
              </Link>
              <Link to="/UserHome" className="support">
              <li className="support">Hi, {custName}</li>
              </Link>
              <button className="signout-button" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="home">
                <li>Home</li>
              </Link>
              <Link to="/quote" className="quote">
                <li>Quote</li>
              </Link>
              <Link to="/ship" className="ship">
                <li>Ship</li>
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

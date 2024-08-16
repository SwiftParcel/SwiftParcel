import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css'; // You might want to create a separate CSS file for the Collection Center layout
import { FaBox, FaShippingFast, FaPrint, FaBell, FaChartLine, FaBars, FaHome } from 'react-icons/fa';
import Logo from '../Images/logo-white-tr.png';

const CollectionCenterLayout = ({ children }) => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="logo-container">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <ul>
        <li><NavLink to="/collectionDash" activeClassName="active"><FaHome /> Dashboard</NavLink></li>
          <li><NavLink to="/collectionparcelList" activeClassName="active"><FaShippingFast /> Parcel Management</NavLink></li>
          <li><NavLink to="/userRequestmanagement" activeClassName="active"><FaShippingFast /> User Request Management</NavLink></li>
          <li><NavLink to="/quote" activeClassName="active"><FaPrint /> Parcel Price Calculator</NavLink></li>
          <li><NavLink to="/" > Back To User Site</NavLink></li>
        </ul>
      </div>
      <div className="admin-content">
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {children}
      </div>
    </div>
  );
};

export default CollectionCenterLayout;

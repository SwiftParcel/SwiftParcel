import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import { FaUser, FaBox, FaWarehouse, FaMapMarkedAlt, FaChartBar, FaCog, FaBars ,FaHome} from 'react-icons/fa';
import Logo from '../Images/logo-white-tr.png';

const AdminLayout = ({ children }) => {
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
        <li><NavLink to="/adminDash" activeClassName="active"><FaHome /> Dashboard</NavLink></li>
          <li><NavLink to="/hiring" activeClassName="active"><FaUser /> Employee Management</NavLink></li>
          {/* <li><NavLink to="/adminparcelList" activeClassName="active"><FaBox /> Parcel Management</NavLink></li> */}
          <li><NavLink to="/admincollectionList" activeClassName="active"><FaWarehouse /> Collection Center Management</NavLink></li>
          <li><NavLink to="/adminhublist" activeClassName="active"><FaMapMarkedAlt /> Hub Management</NavLink></li>
          <li><NavLink to="/admin/analytics-reports" activeClassName="active"><FaChartBar /> Analytics & Reports</NavLink></li>
          <li><NavLink to="/admin/settings" activeClassName="active"><FaCog /> Settings</NavLink></li>
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

export default AdminLayout;

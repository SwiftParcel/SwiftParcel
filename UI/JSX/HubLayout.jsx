import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import { FaUser, FaBox, FaWarehouse, FaMapMarkedAlt, FaChartBar, FaCog, FaBars ,FaHome, FaChartLine, FaClipboardList, FaMapMarkerAlt, FaRoute} from 'react-icons/fa';
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
        <li><NavLink to="/hubDash" activeClassName="active"><FaHome /> Dashboard</NavLink></li>
          <li><NavLink to="/admin/user-management" activeClassName="active"><FaBox /> Parcel Transfer</NavLink></li>
          <li><NavLink to="/aadminparcelList" activeClassName="active"><FaRoute /> Route Management</NavLink></li>
          <li><NavLink to="/aadmincollectionList" activeClassName="active"><FaMapMarkerAlt /> Hub Operations</NavLink></li>
          <li><NavLink to="/aadminhublist" activeClassName="active"><FaClipboardList />Inventory Management</NavLink></li>
          <li><NavLink to="/aadmin/analytics-reports" activeClassName="active"><FaChartLine />Performance Metrics</NavLink></li>

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

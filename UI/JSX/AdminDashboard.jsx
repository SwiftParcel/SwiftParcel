import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import './AdminLayout.jsx'
import { FaUser, FaBox, FaWarehouse, FaMapMarkedAlt, FaChartBar, FaCog } from 'react-icons/fa';

import backgroundImage from '../Images/hero-landing.jpg';
import AdminLayout from './AdminLayout.jsx';

const AdminDashboard = () => {
  return (
    <AdminLayout>
    <div className="dashboard-container">
        <section className="admindash-hero" style={{ backgroundImage: `url(${backgroundImage})`}}>
        <div className="admindash-hero-overlay">
          <div className="admindash-hero-content">
            <h1>Admin Dashboard</h1>
            <h2>Welcome Boss!!!</h2>
          </div>
        </div>
      </section>
      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <Link to={item.link} className="card-link" key={index}>
            <div className="dashboard-card">
              <div className={`card-header ${item.className}`}>
                <div className="card-icon">{item.icon}</div>
              </div>
              <h2 className="card-title">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
};

const dashboardItems = [
  { title: 'Employee Management', link: '/hiring', icon: <FaUser />, className: 'user-management' },
  // { title: 'Parcel Management', link: '/adminparcelList', icon: <FaBox />, className: 'parcel-management' },
  { title: 'Collection Center Management', link: '/AdminCollectionList', icon: <FaWarehouse />, className: 'collection-center-management' },
  { title: 'Hub Management', link: '/adminhublist', icon: <FaMapMarkedAlt />, className: 'hub-management' },
  { title: 'Analytics & Reports', link: '/analytics-reports', icon: <FaChartBar />, className: 'analytics-reports' },
  { title: 'Settings', link: '/settings', icon: <FaCog />, className: 'settings' },
];

export default AdminDashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import './CollectionCenterDashboard.css';
import './CollectionCenterLayout.jsx';
import { FaBox, FaShippingFast, FaPrint, FaBell, FaChartLine,FaBoxOpen } from 'react-icons/fa';

import backgroundImage from '../Images/hero-landing.jpg';
import AdminLayout from './AdminLayout.jsx';
import CollectionCenterLayout from './CollectionCenterLayout.jsx';

const CollectionCenterDashboard = () => {
  return (
    <CollectionCenterLayout>
      <div className="dashboard-container">
        <section className="admindash-hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="admindash-hero-overlay">
            <div className="admindash-hero-content">
              <h1>Collection Center Dashboard</h1>
              <h2>Welcome Employee!</h2>
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
    </CollectionCenterLayout>
  );
};

const dashboardItems = [
  { title: 'Parcel Intake', link: '/parcel-intake', icon: <FaBox />, className: 'parcel-intake' },
  { title: 'Parcel Management', link: '/collectionparcelList', icon: <FaBoxOpen />, className: 'parcel-management' },
  { title: 'Dispatch Management', link: '/dispatch-management', icon: <FaShippingFast />, className: 'dispatch-management' },
  { title: 'Print Parcel Labels', link: '/print-labels', icon: <FaPrint />, className: 'print-labels' },
  { title: 'Notifications', link: '/notifications', icon: <FaBell />, className: 'notifications' },
  { title: 'Performance Tracking', link: '/performance-tracking', icon: <FaChartLine />, className: 'performance-tracking' },
];

export default CollectionCenterDashboard;

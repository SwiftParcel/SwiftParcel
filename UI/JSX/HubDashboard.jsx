import React from 'react';
import { Link } from 'react-router-dom';
import './HubDashboard.css'; // Create this CSS file for styling if needed
import HubLayout from './HubLayout.jsx'
;import { FaBox, FaMapMarkerAlt, FaRoute, FaClipboardList, FaChartLine } from 'react-icons/fa';
import backgroundImage from '../Images/hero-landing.jpg';

const HubDashboard = () => {
  const dashboardItems = [
    { title: 'Parcel Transfer', link: '/parcel-transfer', icon: <FaBox />, className: 'parcel-transfer' },
    { title: 'Route Management', link: '/route-management', icon: <FaRoute />, className: 'route-management' },
    { title: 'Hub Operations', link: '/hub-operations', icon: <FaMapMarkerAlt />, className: 'hub-operations' },
    { title: 'Inventory Management', link: '/inventory-management', icon: <FaClipboardList />, className: 'inventory-management' },
    { title: 'Performance Metrics', link: '/performance-metrics', icon: <FaChartLine />, className: 'performance-metrics' },
  ];

  return (
    <HubLayout>
    <div className="hub-dashboard-container">
      <section className="hub-hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hub-hero-overlay">
          <div className="hub-hero-content">
            <h1>Hub Dashboard</h1>
            <h2>Welcome Team!!</h2>
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
    </HubLayout>
  );
};

export default HubDashboard;

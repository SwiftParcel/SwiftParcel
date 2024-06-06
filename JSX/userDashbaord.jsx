// CompanyDetails.jsx
import React from 'react';

const userDashbaord = () => {
  return (
    <div style={containerStyle}>
      <h2>User DashBoard</h2>
      <p style={paragraphStyle}>
      User DashBoard
      </p>
      
    </div>
  );
};

const containerStyle = {
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const paragraphStyle = {
  textAlign: 'justify',
};

const infoStyle = {
  margin: '5px 0',
};

export default userDashbaord;

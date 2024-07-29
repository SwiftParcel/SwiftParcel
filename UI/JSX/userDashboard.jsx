import React, { useEffect, useState } from 'react';
import { FaTruck, FaClipboardCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Cust_name: '',
    cust_contact: '',
    cust_email: '',
  });
  const [trackingID, setTrackingID] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const loginId = localStorage.getItem('loginId');
      if (!loginId) {
        setError('No user is logged in');
        setLoading(false);
        return;
      }

      const query = `
        query getUserDetails($Id: ID!) {
          getUserDetails(Id: $Id) {
            Cust_name
            cust_contact
            cust_email
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
        if (result.data.getUserDetails) {
          setUserDetails(result.data.getUserDetails);
          setFormData(result.data.getUserDetails);
        } else {
          setError('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('An error occurred while fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const mutation = `
      mutation updateUser($Id: ID!, $Cust_name: String, $cust_contact: String, $cust_email: String) {
        updateUser(Id: $Id, Cust_name: $Cust_name, cust_contact: $cust_contact, cust_email: $cust_email) {
          Cust_name
          cust_contact
          cust_email
        }
      }
    `;
    const loginId = localStorage.getItem('loginId');
    const variables = { Id: loginId };
    if (formData.Cust_name) variables.Cust_name = formData.Cust_name;
    if (formData.cust_contact) variables.cust_contact = formData.cust_contact;
    if (formData.cust_email) variables.cust_email = formData.cust_email;

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      const result = await response.json();
      console.log("Result from server:", result);
      if (result.data && result.data.updateUser) {
        setUserDetails(result.data.updateUser);
        setIsEditing(false);
      } else {
        setError('Failed to update user details');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      setError('An error occurred while updating user details');
    }
  };

  const handleSearchChange = (e) => {
    setTrackingID(e.target.value);
  };

  const handleNavigation = (e) => {
    e.preventDefault();
    if (trackingID.trim()) {
      navigate(`/tracking/${trackingID}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!userDetails) {
    return <div>No user details available</div>;
  }

  return (
    <div className="userdash-container">
      <header className="userdash-header">
        <h1>Swift Parcels</h1>
        <h5>User Dashboard</h5>
      </header>
      <div className="userdash-content">
        <aside className="userdash-sidebar">
          <Link to="/userCollectionRequest" className="userdash-card-link">
            <div className="userdash-card">
              <FaTruck className="userdash-icon" />
              <h3>Request Pickup</h3>
            </div>
          </Link>
          <Link to="/userPickUpRequestStatus" className="userdash-card-link">
            <div className="userdash-card">
              <FaClipboardCheck className="userdash-icon" />
              <h3>Check Pickup Status</h3>
            </div>
          </Link>
        </aside>
        <main className="userdash-main">
          <div className="userdash-details-card">
            <h2>User Details</h2>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="userdash-form">
                <div className="userdash-form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="Cust_name"
                    value={formData.Cust_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="userdash-form-group">
                  <label>Contact:</label>
                  <input
                    type="text"
                    name="cust_contact"
                    value={formData.cust_contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="userdash-form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="cust_email"
                    value={formData.cust_email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="userdash-form-actions">
                  <button type="submit" className="userdash-btn userdash-btn-save">Save</button>
                  <button type="button" onClick={handleEditToggle} className="userdash-btn userdash-btn-cancel">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="userdash-details">
                <p><strong>Name:</strong> {userDetails.Cust_name}</p>
                <p><strong>Contact:</strong> {userDetails.cust_contact}</p>
                <p><strong>Email:</strong> {userDetails.cust_email}</p>
                <button onClick={handleEditToggle} className="userdash-btn userdash-btn-edit">Edit</button>
              </div>
            )}
          </div>
          <div className="userdash-search">
            <form onSubmit={handleNavigation} className="userdash-form">
              <div className="userdash-form-group">
                <label>Tracking ID:</label>
                <input
                  type="text"
                  name="trackingID"
                  value={trackingID}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="userdash-btn userdash-btn-search">Search</button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <footer className="userdash-footer">
        <p>&copy; 2024 Swift Parcels. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeRegister.css'; // Import your CSS file here
import AdminLayout from './AdminLayout.jsx';

const EmployeeRegister = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hubs, setHubs] = useState([]);
  const [collections, setCollections] = useState([]);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const contactRef = useRef(null);
  const emailRef = useRef(null);
  const shiftRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const locationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              hubList {
                id
                Name
              }
              collectionList {
                id
                Name
              }
            }
          `
        }),
      });

      const data = await response.json();
      setHubs(data.data.hubList);
      setCollections(data.data.collectionList);
    } catch (error) {
      console.error('Error fetching lists:', error.message);
      setError('Failed to fetch lists');
    }
  };

  const onCreateEmployee = async (e) => {
    e.preventDefault();

    const Name = nameRef.current.value.trim();
    const Role = roleRef.current.value;
    const Contact = contactRef.current.value.trim();
    const Email = emailRef.current.value.trim();
    const Shift = shiftRef.current.value;
    const Password = passwordRef.current.value.trim();
    const ConfirmPassword = confirmPasswordRef.current.value.trim();
    const Location = locationRef.current.value;

    if (Password !== ConfirmPassword) {
      setError('Password mismatch');
      return;
    }

    try {
      const emailExists = await checkEmailExistsEmp(Email);
      if (emailExists) {
        setError('Email already exists');
        return;
      }

      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation addEmployee($employee: EmployeeInput!) {
              addEmployee(employee: $employee) {
                emp_ID
                Emp_name
                emp_role
                emp_location
                emp_contact
                emp_email
                shift
                log_id
              }
            }
          `,
          variables: {
            employee: {
              Emp_name: Name,
              emp_role: Role,
              emp_location: Location,
              emp_contact: Contact,
              emp_email: Email,
              shift: Shift,
              username: Email,
              password: Password,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        setError(result.errors[0].message);
        setSuccess('');
      } else {
        setSuccess('Employee registration successful');
        setError('');

        // Clear the form fields
        nameRef.current.value = '';
        roleRef.current.value = '';
        contactRef.current.value = '';
        emailRef.current.value = '';
        shiftRef.current.value = '';
        passwordRef.current.value = '';
        confirmPasswordRef.current.value = '';
        locationRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setError('Failed to create employee');
    }
  };

  const checkEmailExistsEmp = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query CheckEmailEmp($Email: String!) {
              checkEmailEmp(Email: $Email) {
                emp_email
              }
            }
          `,
          variables: {
            Email: email,
          },
        }),
      });

      const result = await response.json();
      return result.data.checkEmailEmp !== null;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  };

  return (
    <AdminLayout>
    <div className="employee-form-container">
      <form onSubmit={onCreateEmployee} name="createEmployee">
        <h1 className="employee-h1-primary">Register Employee</h1>
        <input type="text" placeholder="Name" name="Name" id="Name" required ref={nameRef} className="employee-input" />
        <select name="Role" id="Role" required ref={roleRef} className="employee-select">
          <option value="">Select Role</option>
          <option value="manager">Manager</option>
          <option value="packaging">Packaging</option>
          <option value="delivery">Delivery</option>
          <option value="sorting">Sorting</option>
        </select>
        <input type="tel" placeholder="Contact" name="Contact" id="Contact" ref={contactRef} className="employee-input" />
        <input type="email" placeholder="Email" name="Email" id="Email" required ref={emailRef} className="employee-input" />
        <select name="Shift" id="Shift" ref={shiftRef} className="employee-select">
          <option value="">Select Shift</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
        <select name="Location" id="Location" ref={locationRef} className="employee-select">
          <option value="">Select Location</option>
          {hubs.map((hub) => (
            <option key={hub.id} value={hub.Name}>
              {hub.Name}
            </option>
          ))}
          {collections.map((collection) => (
            <option key={collection.id} value={collection.Name}>
              {collection.Name}
            </option>
          ))}
        </select>
        <input type="password" placeholder="Password" name="Password" id="Password" required ref={passwordRef} className="employee-input" />
        <input type="password" placeholder="Confirm Password" name="ConfirmPassword" id="ConfirmPassword" required ref={confirmPasswordRef} className="employee-input" />
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button className="employee-button">Register</button>
      </form>
    </div>
    </AdminLayout>
  );
};

export default EmployeeRegister;

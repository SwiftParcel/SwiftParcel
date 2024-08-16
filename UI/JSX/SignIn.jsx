import React, { Component,useState  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Public/AuthContext';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: '',
      loginSuccess: '',
      userType: '',
      hubs: [],
      collectionLists: [],
    };
  }
  componentDidMount() {
    this.loadCollectionLists();
    this.loadHubs();
  }
  async loadHubs() {
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
                StreetNo
                City
                State
                Country
                isActive
              }
            }
          `
        }),
      });

      const result = await response.json();

      this.setState({ hubs: result.data.hubList });
    } catch (error) {
      console.error('Error fetching hubs:', error.message);
      this.setState({ error: 'Failed to fetch hubs' });
    }
  }
  async loadCollectionLists() {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              collectionList {
                id
                Name
                StreetNo
                City
                State
                Country
                isActive
              }
            }
          `
        }),
      });

      const result = await response.json();

      this.setState({ collectionLists: result.data.collectionList });
    } catch (error) {
      console.error('Error fetching collectionList:', error.message);
      this.setState({ error: 'Failed to fetch collectionList' });
    }
  }
  onLogin = async (e) => {
    e.preventDefault();
    const form = document.forms.loginForm;
  
    const Email = form.Email.value.trim();
    const Password = form.Password.value.trim();

    const query = `
      query login($Email: String!, $Password: String!) {
        login(Email: $Email, Password: $Password) {
          login_Id
          username
          user_type
          isDeleted
        }
      }
    `;
    const variables = { Email, Password };

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });
      const result = await response.json();
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        this.setState({ loginError: 'Login failed', loginSuccess: '' });
      } else if (!result.data || !result.data.login) {
        this.setState({ loginError: 'Incorrect Username or Password', loginSuccess: '' });
      } else {
        this.setState({ loginSuccess: 'Login successful', loginError: '', userType: result.data.login.user_type });
        const { login } = this.props.auth;
        login(result.data.login);
        console.log('result.data.login = :'+result.data.login);
        // Redirect based on user type
        let userType = result.data.login.user_type;
        console.log('UserType is = :'+userType);
        const Id=result.data.login.login_Id;
        localStorage.setItem('loginId', Id);
        const query = `
      query getEmployeeDetails($Id: ID!) {
        getEmployeeDetails(Id: $Id) {
          emp_location
        }
      }
    `;
    const variables = { Id };
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result1 = await response.json();
    if (result1.data.getEmployeeDetails) {
      console.log('getEmployeeDetails emp_location = :'+result1.data.getEmployeeDetails.emp_location);
    const emp_location= result1.data.getEmployeeDetails.emp_location;
    
    if(this.state.hubs.some(item => emp_location === item.Name)){
      userType="EmployeeHub";
    }
    if(this.state.collectionLists.some(item => emp_location === item.Name)){
      userType="EmployeeCollection";
    }
    }
    
    console.log('userType :'+userType);
        if (userType === 'User') {
          this.props.navigate('/UserHome');
        } else if (userType === 'Admin') {
          this.props.navigate('/AdminHome');
        } else if (userType === 'EmployeeCollection') {
          this.props.navigate('/collectionDash');
        } else if (userType === 'EmployeeHub') {
          this.props.navigate('/hubDash');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      this.setState({ loginError: 'An error occurred. Please try again.', loginSuccess: '' });
    }
  };

  render() {
    return (
      <div className="form-container sign-in-container">
        <form onSubmit={this.onLogin} name="loginForm">
          <h1 className="h1-primary">Sign in</h1>
          <input type="text" placeholder="Username" name="Email" required />
          <input type="password" placeholder="Password" name="Password" required />
          <div style={{ color: 'red' }}>{this.state.loginError}</div>
          <div style={{ color: 'green' }}>{this.state.loginSuccess}</div>
          <button className="button">Sign In</button>
          <Link to="/forgot-password">Forgot Password?</Link>
        </form>
      </div>
    );
  }
}

export default (props) => {
  const navigate = useNavigate();
  const auth = useAuth();
  return <SignIn {...props} navigate={navigate} auth={auth} />;
};
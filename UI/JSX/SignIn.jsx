import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Public/AuthContext';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginError: '',
      loginSuccess: '',
      userType: '',
    };
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

        // Redirect based on user type
        const userType = result.data.login.user_type;
        console.log('UserType is = :'+userType);
        if (userType === 'User') {
          this.props.navigate('/UserHome');
        } else if (userType === 'Admin') {
          this.props.navigate('/AdminHome');
        } else if (userType === 'Employee') {
          this.props.navigate('/EmployeeHome');
        } else if (userType === 'Collection') {
          this.props.navigate('/CollectionHome');
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
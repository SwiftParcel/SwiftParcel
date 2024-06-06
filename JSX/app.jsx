import React, { Component } from "react";
import "../public/signin.css";
import logo from '../Images/logo-dark-tr.png';
import backgroundImage from '../Images/bg_sign.jpg';
import { useNavigate,Routes, Route, } from 'react-router-dom';
import Home from './Home.jsx';
import UserDashbaord from './userDashbaord.jsx';
import { Link } from "react-router-dom";
const NotFound = () => <h1>Page Not Found</h1>;

class App extends Component {
   
  constructor(props) {
    super(props);
    this.state = {
      rightPanelActive: false,
      error: '',
      success: '',
      loginError: '',
      loginSuccess: '',
      navigate : '',
     
    };
  }

  handleSignInClick = () => {
    this.setState({ rightPanelActive: false });
  };

  handleSignUpClick = () => {
    this.setState({ rightPanelActive: true });
  };

  
  render() {
  
    
  
    return (
      <div>
      <div className="body-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="image-container">
          <img src={logo} alt="Logo" />
        </div>
        <div className={`container ${this.state.rightPanelActive ? "right-panel-active" : ""}`}>
          <div className="form-container sign-up-container">
            <form onSubmit={this.onCreateAccount} name="createAccount" >
              <h1 className="h1-primary">Create Account</h1>
              <input type="text" placeholder="Name" name="Name" id="Name" required />
              <input type="email" placeholder="Email" name="Email" id="Email" required />
              <input type="password" placeholder="Password" name="Password" id="Password" required />
              <input type="password" placeholder="Confirm Password" name="ConfirmPassword" id="ConfirmPassword" required />
              <div style={{ color: 'red' }}>{this.state.error}</div>
              <div style={{ color: 'green' }}>{this.state.success}</div>
              <button className="button">Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form onSubmit={this.onLogin} name="loginForm">
              <h1 className="h1-primary">Sign in</h1>
              <input type="email" placeholder="Email" name="Email" required />
              <input type="password" placeholder="Password" name="Password" required />
              <div style={{ color: 'red' }}>{this.state.loginError}</div>
              <div style={{ color: 'green' }}>{this.state.loginSuccess}</div>
              <button className="button">Sign In</button>
              
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button className="ghost-button" onClick={this.handleSignInClick}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter Your personal details and start journey with us</p>
                <button className="ghost-button" onClick={this.handleSignUpClick}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </div>
    );
  }
}

export default App;
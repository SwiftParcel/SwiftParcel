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

onCreateAccount = (e) => {
    e.preventDefault();
    const form = document.forms.createAccount;

    const Password = form.Password.value.trim();
    const Email = form.Email.value.trim();
    const Name = form.Name.value.trim();
    const ConfirmPassword = form.ConfirmPassword.value.trim();

    if (Password !== ConfirmPassword) {
      this.setState({ error: 'Password mismatch' });
      return;
    }

    if (!/^[a-zA-Z]+$/.test(Name)) {
      this.setState({ error: 'Name should contain only text' });
      return;
    }

    this.setState({ error: '' });
    const defaultUserType = "User";
    const userdata = {
      Name,
      Email,
      Password,
      UserType: defaultUserType,
      isDeleted: 1,
    };

    this.createUser(userdata);
  };

  async createUser(userdata) {

    const Email = userdata.Email;
    console.log("................Email..."+Email)
    const query = `query checkEmailData($Email: String!) {
      checkEmail(Email:$Email) {
        id
        Name
        Email
        Password
        UserType
        isDeleted
       
    }
    
    }`;
    const variables = {
      Email: Email,
    };

    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    console.log(result.data.checkEmail);
    if (result.data.checkEmail === null || (result.data.checkEmail!=null && result.data.checkEmail.length <=0)) {
      const query = `
      mutation {
        addUser(user: {
          Name: "${userdata.Name}"
          Email: "${userdata.Email}"
          Password: "${userdata.Password}"
          UserType: "${userdata.UserType}"
          isDeleted: ${userdata.isDeleted}
        }) {
          id
          Name
          Email
          Password
          UserType
          isDeleted
        }
      }
    `;

    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      this.setState({ success: '', error: result.errors[0].message });
    } else {
      this.setState({ success: 'Registration successfull', error: '' });
      
    }
    } else {
      this.setState({ success: '', error: 'Email already exists' });
    }

    
  }


  onLogin = async (e) => {
    e.preventDefault();
    const form = document.forms.loginForm;
    const Email = form.Email.value.trim();
    const Password = form.Password.value.trim();
    console.log("Email.."+Email);
    console.log("Password.."+Password);
    const query = `query loginData($Email: String!,$Password: String!) {
      login(Email:$Email,Password: $Password) {
        id
        Name
        Email
        Password
        UserType
        isDeleted
       
    }
    
    }`;
    const variables = {
      Email: Email,
      Password: Password,
    };

    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const result = await response.json();
    console.log(result.data.login);
    if (result.data.login === null || (result.data.login!=null && result.data.login.length <=0)) {
      this.setState({ loginError: "Incorrect UserName or Password", loginSuccess: '' });
    } else {
      this.setState({ loginSuccess: "Login successful", loginError: '' });
      console.log("this.props.navigate");
      window.location.href = '/#/Home';
    }
  };

  render() {
  
    console.log("........loginSuccess..."+this.state.loginSuccess);
   if (this.state.loginSuccess==="Login successful") {
    this.setState({ loginSuccess: '', loginError: '' });
      console.log("........loginSuccess..."+this.state.loginSuccess);
      return (
        
        <>
        
            <Routes>

            <Route path='/' element={<UserDashbaord />} />
            <Route path='/Home' element={<UserDashbaord  />} />
            <Route path='*' element={<NotFound />} />
            </Routes>
        </>
      )
    }
    

  
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
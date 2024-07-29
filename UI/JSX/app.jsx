
import React, { useState, useEffect } from 'react';
import "../public/signin.css";
import logo from '../Images/logo-dark-tr.png';
import backgroundImage from '../Images/bg_sign.jpg';
import { useNavigate,Routes, Route, useLocation} from 'react-router-dom';
import SignUp from './SignUp.jsx';
import SignIn from './SignIn.jsx';
import Navbar from './NavBar.jsx';
import AboutUs from './AboutUs.jsx'
import Home from './Home.jsx';
import EmployeeRegister from './EmployeeRegister.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import UserDashbaord from './userDashbaord.jsx';
import AdminDashbaord from './AdminDashboard.jsx';
import HubDashbaord from './HubDashboard.jsx';
import Hub from './hubList.jsx'
import Collection from './collectionList.jsx'
import CollectionDashbaord from './CollectionCenterDashboard.jsx';
import CollectionParcel from './collectionParcelList.jsx'
import CollectionParcelEdit from './CollectionParcelEdit.jsx'
import HubEdit from './hubEdit.jsx'
import HubDelete from './HubDelete.jsx'
import CollectionEdit from './CollectionEdit.jsx'
import CollectionDelete from './CollectionDelete.jsx'
import ContactUs from './ContactUs.jsx';
import CollectionCenterLayout from './CollectionCenterLayout.jsx'
import { Link } from "react-router-dom";
import { AuthProvider } from '../Public/AuthContext';
const NotFound = () => <h1>Page Not Found</h1>;

const App = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/signup') {
      setRightPanelActive(true);
    } else if (location.pathname === '/signin') {
      setRightPanelActive(false);
    }
  }, [location]);

  const handleSignInClick = () => {
    setRightPanelActive(false);
    navigate('/signin');
  };

  const handleSignUpClick = () => {
    setRightPanelActive(true);
    navigate('/signup');
  };

  const isSignInOrSignUpPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <AuthProvider>
      <div>
        <Navbar />
        {isSignInOrSignUpPage ? (
          <div className="body-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="image-container">
              <img src={logo} alt="Logo" />
            </div>
            <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>To keep connected with us please login with your personal info</p>
                    <button className="ghost-button" onClick={handleSignInClick}>Sign In</button>
                  </div>
                  <div className="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start your journey with us</p>
                    <button className="ghost-button" onClick={handleSignUpClick}>Sign Up</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/UserHome' element={<UserDashbaord  />} />
            <Route path="/hiring" element={<EmployeeRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/AdminHome' element={<AdminDashbaord  />} />
            <Route path='/EmployeeHome' element={<UserDashbaord  />} />
            <Route path='/collectionList' element={<Collection  />} />
            <Route path='/hublist' element={<Hub  />} />
            <Route path='/parcelList' element={<CollectionParcel />} />
            <Route path='/adminhublist' element={<Hub />} />
        <Route path='/AdminCollectionList' element={<Collection />} />
        <Route path='/collectionparcelList' element={<CollectionCenterLayout><CollectionParcel /></CollectionCenterLayout>} />
        <Route path='/adminDash' element={<AdminDashbaord />} />
        <Route path='/collectionDash' element={<CollectionDashbaord />} />
        <Route path='/hubDash' element={<HubDashbaord />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/aboutUs' element={<AboutUs/>}/>
        <Route
          path='/editHub/:id'
          element={<HubEdit navigate={navigate} />}
        />
       
        <Route
          path='/deleteHub/:id'
          element={<HubDelete navigate={navigate} />}
        />
        <Route
          path='/editCollection/:id'
          element={<CollectionEdit navigate={navigate} />}
        />
       
        <Route
          path='/deleteCollection/:id'
          element={<CollectionDelete navigate={navigate} />}
        />

        <Route
          path='/editCollectionParcel/:id'
          element={<CollectionParcelEdit navigate={navigate} />}
        />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
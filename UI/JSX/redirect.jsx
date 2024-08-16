import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Home from './Home.jsx';
import App from './app.jsx';
import Navbar from './NavBar.jsx';
import AboutUs from './AboutUs.jsx'
import UserDashboard from './userDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import HubDashboard from './HubDashboard.jsx';
import CollectionCenterDashboard from './CollectionCenterDashboard.jsx';
import HubList from './hubList.jsx';
import PriceCalculator from './PriceCalculator.jsx';
import CollectionList from './collectionList.jsx';
import CollectionParcelList from './collectionParcelList.jsx';
import CollectionParcelEdit from './CollectionParcelEdit.jsx';
import Autocomplete from './Autocomplete.jsx';
import HubParcelList from './HubParcelList.jsx';
import HubParcelEdit from './HubParcelEdit.jsx';
import HubEdit from './hubEdit.jsx';
import HubDelete from './HubDelete.jsx';
import CollectionEdit from './CollectionEdit.jsx';
import CollectionDelete from './CollectionDelete.jsx';
import ContactUs from './ContactUs.jsx';
import AdminLayout from './AdminLayout.jsx';
import CollectionCenterLayout from './CollectionCenterLayout.jsx';
import HubLayout from './HubLayout.jsx'
import EmployeeRegister from './EmployeeRegister.jsx';
import UserPickUpRequestCreation from'./UserPickUpRequestCreation.jsx';
import UserPickUpRequestStatus from './userPickUpRequestStatus.jsx';
import UserPickUpRequestList from './UserPickUpRequestList.jsx';
import UserPickUpRequestStatusUpdate from './UserPickUpRequestStatusUpdate.jsx';
import Tracking from './Tracking.jsx';
import CollectionParcelReport from './collectionParcelReport.jsx';
const NotFound = () => <h1>Page Not Found</h1>;

const RedirectPage = () => {
  const navigate = useNavigate();
  const [isAdmin] = useState(false); // State to track admin view

  const [isCollectionCenter, setIsCollectionCenter] = useState(false); 
  const checkCollectionCenter = (path) => {
    setIsCollectionCenter(path.startsWith('/collection'));
  };
  const [isHub, setIsHub] = useState(false); 
  const checkHub = (path) => {
    setIsCollectionCenter(path.startsWith('/hub'));
  };
 
  return (
    <>
       {!isAdmin && !isCollectionCenter && !isHub && <Navbar />} {/* Render Navbar if not in admin view */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<App />} />
        <Route path='/openAccount' element={<App />} />
        <Route path='/signinMenu' element={<App />} />
        <Route path='/UserHome' element={<UserDashboard />} />
        <Route path='/hubDash' element={<HubDashboard />} />
        <Route path='/collectionDash' element={<CollectionCenterDashboard />} />
        <Route path='/adminhublist' element={<HubList />} />
        <Route path='/AdminCollectionList' element={<CollectionList />} />
        <Route path='/adminparcelList' element={<AdminLayout><CollectionParcelList /></AdminLayout>} />
        <Route path='/collectionparcelList' element={<CollectionCenterLayout><CollectionParcelList /></CollectionCenterLayout>} />
        <Route path='/hubparcelList' element={<HubLayout><HubParcelList /></HubLayout>} />
        <Route path='/userCollectionRequest' element={<UserPickUpRequestCreation />} />
        <Route path='/userPickUpRequestStatus' element={<UserPickUpRequestStatus />} />
        <Route path='/userRequestmanagement' element={<UserPickUpRequestList />} />
        <Route
          path='/editUserRequest/:id'
          element={<UserPickUpRequestStatusUpdate navigate={navigate} />}
        />
        <Route path='/CollectionParcelReport' element={<CollectionParcelReport />} />
        <Route path='/contactUs' element={<ContactUs />} />
        <Route path='/hiring' element={<EmployeeRegister/>}/>
        <Route path='/aboutUs' element={<AboutUs/>}/>
        <Route path='/quote' element={<PriceCalculator/>}/>
        <Route path='/Autocomplete' element={<Autocomplete/>}/>
        <Route path='/adminDash' element={<AdminDashboard />} />
        <Route path='/editHub/:id' element={<HubEdit navigate={navigate} />} />
        <Route path='/deleteHub/:id' element={<HubDelete navigate={navigate} />} />
        <Route path='/editCollection/:id' element={<CollectionEdit navigate={navigate} />} />
        <Route path='/deleteCollection/:id' element={<CollectionDelete navigate={navigate} />} />
        <Route path='/editCollectionParcel/:id' element={<CollectionParcelEdit navigate={navigate} />} />
        <Route path='/editHubParcel/:id' element={<HubParcelEdit navigate={navigate} />} />
        
        <Route path="/tracking/:trackingID" element={<Tracking navigate={navigate} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default RedirectPage;

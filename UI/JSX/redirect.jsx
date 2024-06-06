import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Home from './Home.jsx';
import App from './app.jsx';
import Navbar from './NavBar.jsx';
import UserDashbaord from './userDashbaord.jsx'

const NotFound = () => <h1>Page Not Found</h1>;

export default function NavHeader() {
  const navigate = useNavigate();


  return (
    <>
    <Navbar/>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<App />} />
        <Route path='/openAccount' element={<App />} />
        <Route path='/signinMenu' element={<App />} />
        <Route path='/Home' element={<UserDashbaord />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

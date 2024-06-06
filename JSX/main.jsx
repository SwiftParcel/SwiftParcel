import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './app.jsx';
import Redirect from './redirect.jsx';
import Navbar from './NavBar.jsx';
import Home from './Home.jsx';
import Footer from './footer.jsx'
const root = ReactDOM.createRoot(document.getElementById('contents'));
root.render(
  <Router>
    <Redirect/>
    <Footer/>
  </Router>
);
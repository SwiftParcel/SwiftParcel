import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './app.jsx';
import Redirect from './redirect.jsx';
import Navbar from './NavBar.jsx';
import Home from './Home.jsx';
import Footer from './footer.jsx'
import { ApolloProvider } from '@apollo/client';

import client from '../apollo-client.js';
import { AuthProvider } from '../Public/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('contents'));
root.render(
  <div>
  <React.StrictMode>
    <ApolloProvider client={client}>
    <AuthProvider>
      <Router>
        <App />
        <Footer />
      </Router>
    </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
  
  </div>
);
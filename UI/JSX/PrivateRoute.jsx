import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Public/AuthContext';

const PrivateRoute = ({ children, userType }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user || user.user_type !== userType) {
      navigate('/signin');
    }
  }, [user, userType, navigate]);

  return user && user.user_type === userType ? children : null;
};

export default PrivateRoute;
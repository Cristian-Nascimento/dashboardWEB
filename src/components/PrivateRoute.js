// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { auth } = useContext(AuthContext);

  // If the user is not authenticated, redirect to login page
  if (!auth || !auth.token) {
    return <Navigate to="/" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;

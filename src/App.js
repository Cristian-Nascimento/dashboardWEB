// src/App.js
import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import './App.css';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { auth } = useContext(AuthContext);

  return auth && auth.token ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/transactions" element={<PrivateRoute element={Dashboard} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;

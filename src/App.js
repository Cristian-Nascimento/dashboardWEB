// src/App.js
import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  return auth?.token ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
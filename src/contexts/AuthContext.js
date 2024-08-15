import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Get token from localStorage if available
    const token = localStorage.getItem('authToken');
    return token ? { token, user: { email: '' } } : null;
  });

  useEffect(() => {
    // You might want to perform additional actions when auth changes
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

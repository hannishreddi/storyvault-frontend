// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

// Create the Context
export const AuthContext = createContext();

// Create the Provider Component
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');

  const login = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setLoggedInUser(newUsername);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setLoggedInUser('');
  };

  return (
    <AuthContext.Provider value={{ token, loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
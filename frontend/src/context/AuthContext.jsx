import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          name: decoded.nom,
          email: decoded.email,
          role: decoded.role
        });
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, mot_de_passe) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/utilisateur/login', {
        email,
        mot_de_passe
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.nom,
        email: decoded.email,
        role: decoded.role
      });

      if (decoded.role === 'administrateur') {
        navigate('/admin');
      } else if (decoded.role === 'professeur') {
        navigate('/teacher');
      }

      return true;
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Erreur de connexion');
      } else {
        setError('Une erreur est survenue');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    error,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
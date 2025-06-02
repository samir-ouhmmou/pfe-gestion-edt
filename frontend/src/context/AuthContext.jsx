// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, mot_de_passe) => {
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:8888/api/utilisateur/login', {
//         email,
//         mot_de_passe
//       });

//       const userData = response.data;
//       //data récupère d'pres database
//       const authenticatedUser = {
//         name: userData.nom,
//         email: userData.email,
//         role: userData.role
//       };

//       setUser(authenticatedUser);
//       localStorage.setItem('user', JSON.stringify(authenticatedUser));
//       return true;

//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     isLoading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Token expiré ?
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          const userData = {
            id: decoded.id_utilisateur,
            name: decoded.nom,
            email: decoded.email,
            role: decoded.role
          };
          setUser(userData);

          // Redirection automatique selon le rôle si on est sur /
          if (location.pathname === '/' || location.pathname === '/login') {
            if (decoded.role === 'administrateur') {
              navigate('/admin');
            } else if (decoded.role === 'professeur') {
              navigate('/teacher');
            }
          }
        }
      } catch (e) {
        console.error('Erreur de décodage du token :', e);
        logout();
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
      const userData = {
        id: decoded.id_utilisateur,
        name: decoded.nom,
        email: decoded.email,
        role: decoded.role
      };
      setUser(userData);

      // Redirection après login
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
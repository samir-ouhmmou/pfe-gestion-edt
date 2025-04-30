import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, mot_de_passe) => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8888/api:utilisateur/login', {
        email,
        mot_de_passe
      });

      const userData = response.data;
      //data récupère d'pres database
      const authenticatedUser = {
        name: userData.nom,
        email: userData.email,
        role: userData.role
      };

      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// import React, { createContext, useState, useContext, useEffect } from 'react';

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
//     // Check if user is stored in localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setIsLoading(true);

//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       if (email === 'teacher@school.com' && password === 'password') {
//         const teacherUser = {
//           id: '1',
//           name: 'John Doe',
//           email: 'teacher@school.com',
//           role: 'teacher'
//         };
//         setUser(teacherUser);
//         localStorage.setItem('user', JSON.stringify(teacherUser));
//         return true;
//       } else if (email === 'admin@school.com' && password === 'password') {
//         const adminUser = {
//           id: '2',
//           name: 'Jane Smith',
//           email: 'admin@school.com',
//           role: 'admin'
//         };
//         setUser(adminUser);
//         localStorage.setItem('user', JSON.stringify(adminUser));
//         return true;
//       }
//       return false;
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

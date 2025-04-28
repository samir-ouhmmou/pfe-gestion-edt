import React, { createContext, useState, useContext, useEffect } from 'react';

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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login for demonstration purposes
    // In a real application, this would be an API call
    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'teacher@school.com' && password === 'password') {
        const teacherUser = {
          id: '1',
          name: 'John Doe',
          email: 'teacher@school.com',
          role: 'teacher'
        };
        setUser(teacherUser);
        localStorage.setItem('user', JSON.stringify(teacherUser));
        return true;
      } else if (email === 'admin@school.com' && password === 'password') {
        const adminUser = {
          id: '2',
          name: 'Jane Smith',
          email: 'admin@school.com',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return true;
      }
      return false;
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

// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);

    const API_URL = 'http://localhost:8888/api';

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setIsLoading(false);
    }, []);

    const login = async (email, mot_de_passe) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/utilisateur/login`, { email, mot_de_passe });
            const userData = response.data.user;
            const authToken = response.data.token;
            const authenticatedUser = { name: userData.nom, email: userData.email, role: userData.role };
            setUser(authenticatedUser);
            setToken(authToken);
            localStorage.setItem('user', JSON.stringify(authenticatedUser));
            localStorage.setItem('token', authToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            return true;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${API_URL}/utilisateur/login`);
            const profileData = response.data;
            const updatedUser = { ...user, ...profileData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            if (error.response && error.response.status === 401) {
                logout();
            }
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401 && user) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [user]);

    const value = { user, login, logout, fetchUserProfile, isAuthenticated: !!user, isLoading, token };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

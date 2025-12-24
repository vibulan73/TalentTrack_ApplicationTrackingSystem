import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, email: userEmail, fullName } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName }));
        setUser({ email: userEmail, fullName });

        return response.data;
    };

    const register = async (fullName, email, password) => {
        const response = await api.post('/auth/register', { fullName, email, password });
        const { token, email: userEmail, fullName: userName } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName: userName }));
        setUser({ email: userEmail, fullName: userName });

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

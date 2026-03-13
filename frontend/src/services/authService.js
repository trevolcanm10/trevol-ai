// Servicios de autenticación
import api from "./api";

export const loginService = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    
    const response = await api.post("/auth/login", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
};

export const registerService = async (name, email, phone, password) => {
    const response = await api.post("/auth/register", {
        username: name,
        email: email,
        phone: phone,
        password: password
    });
    return response.data;
};

export const logoutService = () => {
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

// Contexto de autenticación
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const userData = await loginService(email, password);
            setUser(userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        logoutService();
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
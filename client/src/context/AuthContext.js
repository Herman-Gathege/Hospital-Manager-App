import React, { createContext, useState, useEffect } from "react";
import { isAuthenticated, getRole, logout, getToken } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(isAuthenticated());
    const [userRole, setUserRole] = useState(getRole());
    const [username, setUsername] = useState(localStorage.getItem("username") || "User");

    useEffect(() => {
        const token = getToken();
        if (token) {
            setAuthenticated(true);
            setUserRole(getRole());
            setUsername(localStorage.getItem("username") || "User");
        } else {
            setAuthenticated(false);
            setUserRole(null);
            setUsername("User");
        }
    }, []);

    const handleLogin = (role, username, token) => {
        setAuthenticated(true);
        setUserRole(role);
        setUsername(username);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
    };

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
        setUserRole(null);
        setUsername("User");
    };

    return (
        <AuthContext.Provider value={{ authenticated, userRole, username, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

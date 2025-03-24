

// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";
// import { isAuthenticated, getRole, logout } from "../api/authService";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [userRole, setUserRole] = useState(null);
//     const [authenticated, setAuthenticated] = useState(false);
//     const [username, setUsername] = useState(localStorage.getItem("username") || "User");


//     useEffect(() => {
//         const authStatus = isAuthenticated();
//         const role = getRole();
//         const storedUsername = localStorage.getItem("username") || "User";
//         if (authStatus) {
//             setAuthenticated(true);
//             setUserRole(role);
//             setUsername(storedUsername);
//         } else {
//             setAuthenticated(false);
//             setUserRole(null);
//             setUsername("User")
//         }
//         console.log("AuthContext - Authenticated:", authStatus);
//         console.log("AuthContext - User Role:", role);
//         console.log("AuthContext - Username:", storedUsername);

//     }, []);

//     const handleLogin = (role, username) => {
//         setAuthenticated(true);
//         setUserRole(role);
//         setUsername(username); // Set the username on login
//         localStorage.setItem("username", username); // Save to localStorage
//         console.log("User logged in, role set to:", role, "username:", username);

//     };

//     const handleLogout = () => {
//         logout();
//         setAuthenticated(false);
//         setUserRole(null);
//         setUsername("User");
//         localStorage.removeItem("username"); // Clear the username on logout
//     };

//     return (
//         <AuthContext.Provider value={{ authenticated, userRole, username, handleLogin, handleLogout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

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


// src/routes/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authenticated, userRole } = useContext(AuthContext);

    if (!authenticated) {
        console.warn("Not authenticated, redirecting to login");
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.warn("User role not allowed, redirecting to login");
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;

// src/components/PublicLayout.js
import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: 20 }}>
                <Outlet />
            </div>
        </div>
    );
};

export default PublicLayout;

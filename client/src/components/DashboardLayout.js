// src/components/DashboardLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginRight: 20000, padding: 0, width: "100%" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;

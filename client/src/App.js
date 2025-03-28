
// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile"; // Import the new PatientProfile page
import Appointments from "./pages/Appointments";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>

                    {/* Protected Dashboard Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["admin", "doctor", "staff"]}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Nested Dashboard Routes */}
                        <Route index element={<Dashboard />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="patients/:id" element={<PatientProfile />} /> 
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="medical-records" element={<div>Medical Records Page</div>} />
                        <Route path="billing" element={<Billing />} />
                        <Route path="staff" element={<div>Staff Management Page</div>} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="reports" element={<div>Reports Page</div>} />
                        <Route path="settings" element={<div>Settings Page</div>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;


// src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { authenticated, handleLogout } = useContext(AuthContext);

    return (
        <nav style={{ padding: "10px", backgroundColor: "#333", color: "#fff" }}>
            <ul style={{ listStyle: "none", display: "flex", gap: "20px" }}>
                <li><Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link></li>
                {!authenticated ? (
                    <>
                        <li><Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link></li>
                        <li><Link to="/signup" style={{ color: "#fff", textDecoration: "none" }}>Signup</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link></li>
                        <li>
                            <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "#fff", border: "none", cursor: "pointer" }}>
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Hospital Management System</h1>
                <p style={styles.subtitle}>
                    Streamline your hospital operations with our all-in-one solution. Manage patients, appointments, billing, staff, and inventory efficiently.
                </p>
            </header>
            
            <section style={styles.features}>
                <h2 style={styles.featureTitle}>Why Choose Our System?</h2>
                <ul style={styles.featureList}>
                    <li>📅 Easy Appointment Scheduling and Tracking</li>
                    <li>💳 Automated Billing and Payment Processing</li>
                    <li>🗃️ Comprehensive Medical Records Management</li>
                    <li>👥 Efficient Staff and Inventory Management</li>
                    <li>📊 Real-time Reports and Analytics</li>
                    <li>🔒 Secure Role-based Access for Admins, Doctors, and Staff</li>
                </ul>
            </section>
            
            <section style={styles.callToAction}>
                <h3>Get Started Today!</h3>
                <p>Join us and take control of your hospital management.</p>
                <p>Register and get Access to your Hospital Dashboard</p>

                <div style={styles.buttonGroup}>
                    <Link to="/login">
                        <button style={styles.button}>Login</button>
                    </Link>
                    <Link to="/signup">
                        <button style={styles.button}>Signup</button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        padding: "40px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
    },
    header: {
        marginBottom: "30px",
    },
    title: {
        fontSize: "3rem",
        margin: "0",
        color: "#007bff",
    },
    subtitle: {
        fontSize: "1.5rem",
        color: "#555",
    },
    features: {
        marginTop: "30px",
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    featureTitle: {
        fontSize: "2rem",
        marginBottom: "10px",
        color: "#333",
    },
    featureList: {
        listStyleType: "none",
        padding: 0,
        fontSize: "1.1rem",
        color: "#333",
    },
    callToAction: {
        marginTop: "20px",
    },
    buttonGroup: {
        marginTop: "20px",
    },
    button: {
        margin: "5px",
        padding: "12px 20px",
        fontSize: "1rem",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
};

export default Home;

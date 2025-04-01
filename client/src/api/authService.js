// // src/api/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { username, password });
        const { token, role } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const isAuthenticated = () => {
    return !!getToken();
};

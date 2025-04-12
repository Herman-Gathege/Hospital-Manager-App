// // src/api/api.js
import axios from "axios";
import { getAuthHeader } from "./authService";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
        config.headers = {
            ...config.headers,
            ...authHeader,
        };
    }
    return config;
}, (error) => Promise.reject(error));

export default api;

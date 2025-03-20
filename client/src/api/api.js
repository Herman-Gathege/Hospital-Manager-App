// src/api/api.js
import axios from "axios";
import { getAuthHeader } from "./authService";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        ...getAuthHeader(),
    };
    return config;
});

export default api;

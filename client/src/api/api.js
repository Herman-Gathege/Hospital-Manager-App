// // src/api/api.js
// import axios from "axios";
// import { getAuthHeader } from "./authService";

// const api = axios.create({
//     baseURL: "http://localhost:5000",
// });

// api.interceptors.request.use((config) => {
//     config.headers = {
//         ...config.headers,
//         ...getAuthHeader(),
//     };
//     return config;
// });

// export default api;

import axios from "axios";
import { getAuthHeader } from "./authService";

const api = axios.create({
    baseURL: "http://localhost:5000",
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

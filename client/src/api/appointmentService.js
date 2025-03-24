// // src/api/appointmentService.js
// import axios from "axios";

// const API_URL = "http://localhost:5000/appointments/";

// const getAuthHeader = () => {
//     const token = localStorage.getItem("token");
//     return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // Fetch all appointments
// export const getAllAppointments = async () => {
//     try {
//         const response = await axios.get(API_URL, {
//             headers: getAuthHeader(),
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error fetching appointments");
//     }
// };

// // Add a new appointment
// export const addAppointment = async (appointmentData) => {
//     try {
//         const response = await axios.post(API_URL, appointmentData, {
//             headers: {
//                 ...getAuthHeader(),
//                 "Content-Type": "application/json",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error adding appointment");
//     }
// };

// // Get a single appointment by ID
// export const getAppointmentById = async (appointmentId) => {
//     try {
//         const response = await axios.get(`${API_URL}${appointmentId}`, {
//             headers: getAuthHeader(),
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error fetching appointment details");
//     }
// };

// // Update an appointment
// export const updateAppointment = async (appointmentId, appointmentData) => {
//     try {
//         const response = await axios.put(`${API_URL}${appointmentId}`, appointmentData, {
//             headers: {
//                 ...getAuthHeader(),
//                 "Content-Type": "application/json",
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error updating appointment");
//     }
// };

// // Delete an appointment
// export const deleteAppointment = async (appointmentId) => {
//     try {
//         const response = await axios.delete(`${API_URL}${appointmentId}`, {
//             headers: getAuthHeader(),
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error deleting appointment");
//     }
// };

// src/api/appointmentService.js
import axios from "axios";

const API_URL = "http://localhost:5000/appointments/";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all appointments
export const getAllAppointments = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching appointments");
    }
};

// Add a new appointment
export const addAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(API_URL, appointmentData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error adding appointment");
    }
};

// Get a single appointment by ID
export const getAppointmentById = async (appointmentId) => {
    try {
        const response = await axios.get(`${API_URL}${appointmentId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching appointment details");
    }
};

// Update an appointment
export const updateAppointment = async (appointmentId, appointmentData) => {
    try {
        const response = await axios.put(`${API_URL}${appointmentId}`, appointmentData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error updating appointment");
    }
};

// Delete an appointment
export const deleteAppointment = async (appointmentId) => {
    try {
        const response = await axios.delete(`${API_URL}${appointmentId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting appointment");
    }
};

// Fetch all doctors
export const getAllDoctors = async () => {
    try {
        const response = await axios.get(`${API_URL}doctors`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching doctors");
    }
};

// Schedule an appointment
export const scheduleAppointment = async (appointmentData) => {
    try {
        const response = await axios.post(API_URL, appointmentData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error scheduling appointment");
    }
};
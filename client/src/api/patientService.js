// src/api/patientService.js
import axios from "axios";

const API_URL = "http://localhost:5000/patients/";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all patients
export const getAllPatients = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching patients");
    }
};

// Add a new patient
export const addPatient = async (patientData) => {
    try {
        const response = await axios.post(API_URL, patientData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error adding patient");
    }
};

// Get a single patient by ID
export const getPatientById = async (patientId) => {
    try {
        const response = await axios.get(`${API_URL}${patientId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching patient details");
    }
};

// Update a patient
export const updatePatient = async (patientId, patientData) => {
    try {
        const response = await axios.put(`${API_URL}${patientId}`, patientData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error updating patient");
    }
};

// Delete a patient
export const deletePatient = async (patientId) => {
    try {
        const response = await axios.delete(`${API_URL}${patientId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting patient");
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


// export const addMedicalRecord = async (patientId, recordData) => {
//   const response = await axios.post(
//     `/patients/${patientId}/medical_records`,
//     recordData,
//     { headers: { "Content-Type": "application/json" } }
//   );
//   return response.data;
// };

// export const getMedicalRecords = async (patientId) => {
//   const response = await axios.get(`/patients/${patientId}/medical_records`);
//   return response.data;
// };

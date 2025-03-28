// src/api/medicalRecordService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/medical_record/";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new medical record
export const createMedicalRecord = async (patientId, diagnosis, prescription, unitsPrescribed, labResults) => {
    try {
        const response = await axios.post(API_URL, {
            patient_id: patientId,
            diagnosis,
            prescription,
            units_prescribed: unitsPrescribed,
            lab_results: labResults,
        }, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create medical record");
    }
};

// Get all medical records
export const getAllMedicalRecords = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching medical records");
    }
};

// Get a specific medical record by ID
export const getMedicalRecordById = async (recordId) => {
    try {
        const response = await axios.get(`${API_URL}${recordId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching medical record");
    }
};

// Update a medical record
export const updateMedicalRecord = async (recordId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}${recordId}`, updatedData, {
            headers: {
                ...getAuthHeader(),
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error updating medical record");
    }
};

// Delete a medical record
export const deleteMedicalRecord = async (recordId) => {
    try {
        const response = await axios.delete(`${API_URL}${recordId}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting medical record");
    }
};
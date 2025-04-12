import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/dashboard`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getOverviewStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/overview`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching overview stats");
    }
};

export const getPatientStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/patient_stats`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching patient stats");
    }
};

export const getAppointmentStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointment_stats`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching appointment stats");
    }
};

export const getBillingStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/billing_stats`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching billing stats");
    }
};

export const getInventoryStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/inventory_stats`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching inventory stats");
    }
};
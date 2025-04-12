import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/billing/`;


const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getAllBilling = async () => {
    try {
        const response = await axios.get(API_URL, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching billing records");
    }
};



export const addBilling = async (billingData) => {
    try {
        const correctedBillingData = {
            patient_id: billingData.patient_id,
            total_amount_due: billingData.cost,
            drug_name: billingData.drug_name,
            quantity: billingData.quantity
        };

        console.log("Sending Billing Data:", correctedBillingData);  // Debugging

        const response = await axios.post(API_URL, correctedBillingData, {
            headers: { ...getAuthHeader(), "Content-Type": "application/json" }
        });

        return response.data;
    } catch (error) {
        console.error("Error adding billing:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error adding billing record");
    }
};



export const deleteBilling = async (id) => {
    try {
        await axios.delete(`${API_URL}${id}`, { headers: getAuthHeader() });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting billing record");
    }
};

export const updateBilling = async (id, billingData) => {
    try {
        console.log("Updating Billing Record:", id, billingData);  // Debugging

        const response = await axios.put(`${API_URL}${id}`, billingData, {
            headers: { ...getAuthHeader(), "Content-Type": "application/json" }
        });

        console.log("Billing Updated Successfully:", response.data);  // Debugging
        return response.data;
    } catch (error) {
        console.error("Error updating billing:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Error updating billing record");
    }
};




export const getBillingByPatientId = async (patientId) => {
    try {
        const response = await axios.get(`${API_URL}${patientId}`, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching billing records");
    }
};

export const updateBillingStatus = async (id, status) => {
    try {
        const response = await axios.put(`${API_URL}${id}`, { status }, {
            headers: { ...getAuthHeader(), "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating billing status:", error);
        throw new Error(error.response?.data?.message || "Error updating billing status");
    }
};

  
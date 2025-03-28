import axios from "axios";

const API_URL = "http://localhost:5000/api/billing/";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// export const addBilling = async (billingData) => {
//     try {
//         const response = await axios.post(API_URL, billingData, {
//             headers: { ...getAuthHeader(), "Content-Type": "application/json" }
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error.response?.data?.message || "Error adding billing record");
//     }
// };

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
        // Ensure the request payload uses `patient_id` (snake_case)
        const correctedBillingData = {
            patient_id: billingData.patient_id,  // Ensure this is in snake_case
            cost: billingData.cost,
            drug_name: billingData.drug_name,
            quantity: billingData.quantity
        };

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
        const response = await axios.put(`${API_URL}${id}`, billingData, {
            headers: { ...getAuthHeader(), "Content-Type": "application/json" }
        });
        return response.data;
    } catch (error) {
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

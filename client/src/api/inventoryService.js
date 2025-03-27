// import axios from "axios";

// const API_URL = "http://localhost:5000/api/inventory/";

// const getAuthHeader = () => {
//   const token = localStorage.getItem("token");
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const getInventory = async () => {
//   try {
//     const response = await axios.get(API_URL, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error fetching inventory");
//   }
// };

// export const createInventory = async (inventoryData) => {
//   try {
//     const response = await axios.post(API_URL, inventoryData, {
//       headers: {
//         ...getAuthHeader(),
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error creating inventory");
//   }
// };

// export const addInventory = async (inventoryData) => {
//   try {
//     const response = await axios.post(API_URL, inventoryData, {
//       headers: {
//         ...getAuthHeader(),
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error adding inventory");
//   }
// };

// export const updateInventory = async (inventoryId, inventoryData) => {
//   try {
//     const response = await axios.put(`${API_URL}${inventoryId}`, inventoryData, {
//       headers: {
//         ...getAuthHeader(),
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error updating inventory");
//   }
// };

// export const deleteInventory = async (inventoryId) => {
//   try {
//     const response = await axios.delete(`${API_URL}${inventoryId}`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error deleting inventory");
//   }
// };

// export const getInventoryById = async (inventoryId) => {
//   try {
//     const response = await axios.get(`${API_URL}${inventoryId}`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error fetching inventory details");
//   }
// };

// export const getAllInventory = async () => {
//   try {
//     const response = await axios.get(`${API_URL}all`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error fetching inventory");
//   }
// };

// export const searchInventory = async (searchTerm) => {
//   try {
//     const response = await axios.get(`${API_URL}search?searchTerm=${searchTerm}`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error searching inventory");
//   }
// };

// export const getInventoryStats = async () => {
//   try {
//     const response = await axios.get(`${API_URL}stats`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Error fetching inventory stats");
//   }
// };

import api from "./api";

export const getAllInventory = async () => {
    try {
        const response = await api.get("/inventory/all");  // Use "/all"
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error fetching inventory");
    }
};

export const addInventoryItem = async (itemData) => {
    try {
        const response = await api.post("/inventory/add", itemData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error adding inventory item");
    }
};

export const updateInventoryItem = async (id, itemData) => {
    try {
        const response = await api.put(`/inventory/${id}`, itemData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error updating inventory item");
    }
};

export const deleteInventoryItem = async (id) => {
    try {
        await api.delete(`/inventory/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || "Error deleting inventory item");
    }
};

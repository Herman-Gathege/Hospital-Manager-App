
import api from "./api";


export const getAllInventory = async () => {
    try {
        const response = await api.get("/inventory/all");
        console.log("Inventory API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory:", error.response?.data || error.message);
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

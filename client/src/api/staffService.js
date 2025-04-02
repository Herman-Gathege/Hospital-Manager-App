// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api/staff';  // Replace with your Flask server URL

// // Get all staff members
// export const getAllStaff = async () => {
//   try {
//     const response = await axios.get(API_URL, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming you store the JWT token in localStorage
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching staff:', error);
//     throw error;
//   }
// };

// // Create a new

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/staff/';

// Function to get all staff members
export const getAllStaff = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all staff:', error);
    throw error;
  }
};

// Function to get a specific staff member by ID
export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new staff member
export const createStaff = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

// Function to update an existing staff member
export const updateStaff = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating staff with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a staff member
export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting staff with ID ${id}:`, error);
    throw error;
  }
};

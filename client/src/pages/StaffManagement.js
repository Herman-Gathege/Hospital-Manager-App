import React, { useState, useEffect } from 'react';
import { getAllStaff, deleteStaff } from '../api/staffService'; // Import the staff service functions

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all staff members on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getAllStaff();
        setStaffList(data);
      } catch (err) {
        setError('Failed to load staff members');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDelete = async (id) => {
    try {
      await deleteStaff(id);
      setStaffList(staffList.filter((staff) => staff.id !== id)); // Remove deleted staff from the state
    } catch (err) {
      setError('Failed to delete staff member');
    }
  };

  if (loading) return <div>Loading staff members...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Staff Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>{staff.position}</td>
              <td>{staff.email}</td>
              <td>
                <button onClick={() => handleDelete(staff.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;

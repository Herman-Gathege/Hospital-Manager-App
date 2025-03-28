import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../styles/Billing.css";
import { AuthContext } from "../context/AuthContext";
import { getAllBilling, deleteBilling, updateBilling } from "../api/billingService";

const Billing = () => {
  const [billingRecords, setBillingRecords] = useState([]);
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch billing records
  const fetchBillingRecords = async () => {
    try {
      const data = await getAllBilling();
      console.log("Fetched billing records:", data);
      setBillingRecords(data);
    } catch (error) {
      console.error("Error fetching billing records:", error.message);
    }
  };

  useEffect(() => {
    fetchBillingRecords();
  }, []);

  // Handle Delete Billing Record
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this billing record?")) {
      try {
        await deleteBilling(id);
        alert("Billing record deleted successfully!");
        fetchBillingRecords();
      } catch (error) {
        alert("Error deleting billing record: " + error.message);
      }
    }
  };

  // Navigate to billing details
  const handleViewDetails = (id) => {
    navigate(`/dashboard/billing/${id}`);
  };

  return (
    <div className="billing-container">
      {/* Greeting and Print Button */}
      <div className="billing-header">
        <h2>Hello, {username}! Here are the billing records.</h2>
        <Button startIcon={<PrintIcon />} style={{ color: "#007bff" }}>
          Print Records
        </Button>
      </div>

      {/* Billing Records Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Invoice ID</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Patient ID</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Total Amount</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Status</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {billingRecords.length > 0 ? (
            billingRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.patient_id}</TableCell>
                <TableCell>{record.total_amount}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleViewDetails(record.id)}>
                    <VisibilityIcon /> <p>View</p>
                  </IconButton>
                  <IconButton color="success">
                    <EditIcon /> <p>Edit</p>
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(record.id)}>
                    <DeleteIcon /> <p>Delete</p>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5">No billing records found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Billing;

// src/components/AddMedicalRecordModal.js
import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { createMedicalRecord } from "../api/medicalRecordService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const AddMedicalRecordModal = ({ open, onClose, patientId, onSuccess }) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [labResults, setLabResults] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting medical record...");
    console.log("Patient ID:", patientId);
    console.log("Diagnosis:", diagnosis);
    console.log("Prescription:", prescription);
    console.log("Lab Results:", labResults);
  
    try {
      const response = await createMedicalRecord(patientId, diagnosis, prescription, labResults);
      console.log("API Response:", response); // Check what the API returned
      alert("Medical record added successfully!");
      onSuccess(); // Refresh patient data
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding medical record:", error.message);
      alert("Error adding medical record: " + error.message);
    }
  };
  

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" gutterBottom>
          Add Medical Record
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Prescription"
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Lab Results"
            value={labResults}
            onChange={(e) => setLabResults(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "16px" }}
          >
            Save Record
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddMedicalRecordModal;

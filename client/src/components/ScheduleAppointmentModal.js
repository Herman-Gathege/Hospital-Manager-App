// src/components/ScheduleAppointmentModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import {  scheduleAppointment, getAllDoctors } from "../api/appointmentService";

const ScheduleAppointmentModal = ({ open, onClose }) => {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState(""); 
  const [status, setStatus] = useState("scheduled");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctors, setDoctors] = useState([]);


  // Sample data for doctors (you can replace this with real data later)
  // const sampleDoctors = [
  //   { id: 1, name: "Dr. Smith" },
  //   { id: 2, name: "Dr. Lee" },
  //   { id: 3, name: "Dr. Patel" },
  // ];

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async () => {
    const appointmentData = {
      patient_id: patientId,
      doctor_id: doctorId,
      status,
      appointment_date: appointmentDate,
    };

    try {
      await scheduleAppointment(appointmentData);
      alert("Appointment scheduled successfully!");
      onClose();
    } catch (error) {
      alert("Error scheduling appointment: " + error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6">Schedule Appointment</Typography>
        <TextField
          label="Patient ID"
          fullWidth
          margin="dense"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <InputLabel>Doctor</InputLabel>
        <Select
          fullWidth
          margin="dense"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.username}
            </MenuItem>
          ))}
        </Select>        
        <InputLabel>Status</InputLabel>
        <Select
          fullWidth
          margin="dense"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="scheduled">Scheduled</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </Select>
        <TextField
          // label="Appointment Date"
          fullWidth
          margin="dense"
          type="datetime-local"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          style={{ marginTop: "10px" }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onClose}
          style={{ marginTop: "5px" }}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ScheduleAppointmentModal;

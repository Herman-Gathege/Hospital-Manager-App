// src/pages/Appointments.js
import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScheduleAppointmentModal from "../components/ScheduleAppointmentModal";
import "../styles/Appointments.css";
import { AuthContext } from "../context/AuthContext";
import { getAllAppointments } from "../api/appointmentService";

const Appointments = () => {
  const [search, setSearch] = useState("");
  const { username } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Fetch appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllAppointments();
        console.log("Fetched appointments:", data); // Debugging line
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      {/* Greeting and Search Bar */}
      <div className="appointments-greeting">
        <h2>Hello, {username}! You can find appointment details here.</h2>

        <input
          type="text"
          placeholder="Search appointments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="appointments-search-bar"
        />
      </div>

      {/* Links */}
      <div className="appointments-links">
        <Button
          startIcon={<EventIcon />}
          onClick={handleOpenModal}
          style={{ color: "#007bff" }}
        >
          Schedule Appointment
        </Button>
        <Button startIcon={<PrintIcon />} style={{ color: "#007bff" }}>
          Print Details
        </Button>
      </div>

      {/* Appointments Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Select
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Appointment ID
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Patient Name
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Doctor
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Time Created
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Department
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Status
            </TableCell>
            <TableCell
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{appointment.id}</TableCell>
              <TableCell>{appointment.patient_name || ""}</TableCell>
              <TableCell>{appointment.doctor_name || ""}</TableCell>
              <TableCell>{appointment.appointment_date || ""}</TableCell>
              <TableCell>{appointment.department || ""}</TableCell>
              <TableCell>{appointment.status || ""}</TableCell>
              <TableCell>
                <IconButton color="primary">
                  <VisibilityIcon />
                </IconButton>
                <IconButton color="success">
                  <EditIcon />
                </IconButton>
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScheduleAppointmentModal open={openModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Appointments;

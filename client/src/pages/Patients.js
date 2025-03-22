import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddPatientModal from "../components/AddPatientModal";
import "../styles/Patients.css";
import { AuthContext } from "../context/AuthContext";
import { getAllPatients, deletePatient, updatePatient } from "../api/patientService";

const Patients = () => {
  const [search, setSearch] = useState("");
  const { username } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  // Fetch patients from the backend
  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      console.log("Fetched patients:", data); // Debugging line
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditPatient(null);
  };

  // Handle Edit Patient
  const handleEdit = (patient) => {
    setEditPatient(patient);
    setOpenModal(true);
  };

  // Handle Update Patient
  const handleUpdatePatient = async (updatedData) => {
    try {
      await updatePatient(updatedData.id, updatedData);
      alert("Patient updated successfully!");
      fetchPatients();
      handleCloseModal();
    } catch (error) {
      alert("Error updating patient: " + error.message);
    }
  };

  // Handle Delete Patient
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await deletePatient(id);
        alert("Patient deleted successfully!");
        fetchPatients();
      } catch (error) {
        alert("Error deleting patient: " + error.message);
      }
    }
  };

  // Navigate to the patient profile page
  const handleViewProfile = (id) => {
    navigate(`/dashboard/patients/${id}`);
  };

  return (
    <div className="patients-container">
      {/* Greeting and Search Bar */}
      <div className="patients-greeting">
        <h2>Hello, {username}! You can find patient details here.</h2>

        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="patients-search-bar"
        />
      </div>

      {/* Links */}
      <div className="patients-links">
        <Button
          startIcon={<PersonAddIcon />}
          onClick={handleOpenModal}
          style={{ color: "#007bff" }}
        >
          Register New Patient
        </Button>
        <Button startIcon={<PrintIcon />} style={{ color: "#007bff" }}>
          Print Details
        </Button>
      </div>

      {/* Patients Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Select</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Patient ID</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Name</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Gender</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Date of Birth</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Contact</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Address</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Last Visit</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Served by Doctor</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Status</TableCell>
            <TableCell style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{patient.id || ""}</TableCell>
              <TableCell>{`${patient.first_name || ""} ${patient.last_name || ""}`}</TableCell>
              <TableCell>{patient.gender || ""}</TableCell>
              <TableCell>{patient.dob || ""}</TableCell>
              <TableCell>{patient.phone_number || ""}</TableCell>
              <TableCell>{patient.address || ""}</TableCell>
              <TableCell>{patient.last_visit || ""}</TableCell>
              <TableCell>{patient.doctor_name || ""}</TableCell>
              <TableCell>{patient.status || ""}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => handleViewProfile(patient.id)}>
                  <VisibilityIcon /> <p>View</p>
                </IconButton>
                <IconButton color="success" onClick={() => handleEdit(patient)}>
                  <EditIcon /> <p>Edit</p>
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(patient.id)}>
                  <DeleteIcon /> <p>Delete</p>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AddPatientModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={fetchPatients}  // Refresh the patient list on success
        editPatient={editPatient}  // Pass the patient to be edited
      />
    </div>
  );
};

export default Patients;

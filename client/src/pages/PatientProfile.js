import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EventIcon from "@mui/icons-material/Event";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Back icon
import MedicationIcon from "@mui/icons-material/Medication";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById, deletePatient } from "../api/patientService";
import "../styles/PatientProfile.css";

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientData = await getPatientById(id);
        setPatient(patientData);
      } catch (error) {
        console.error("Error fetching patient data:", error.message);
      }
    };

    fetchPatient();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDelete = async () => {
    try {
      await deletePatient(id);
      alert("Patient profile deleted successfully!");
      navigate("/dashboard/patients");
    } catch (error) {
      alert("Error deleting profile: " + error.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!patient) {
    return <p>Loading patient profile...</p>;
  }

  return (
    <div className="patient-profile-container">
      {/* Back Button */}
      <div
        className="back-button"
        onClick={handleBack}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          color: "#007bff",
        }}
      >
        <ArrowBackIcon style={{ marginRight: "5px" }} />
        <span>Back</span>
      </div>

      {/* Profile Header */}
      <div className="patient-profile-header">
        <Avatar
          alt={patient.first_name}
          src={patient.image_path || "/default-avatar.png"}
          sx={{ width: 100, height: 100 }}
          className="patient-avatar"
        />
        <div className="patient-details">
          <Typography
            variant="h5"
            className="patient-name"
          >{`${patient.first_name} ${patient.last_name}`}</Typography>
          <Typography className="patient-info">ID: {patient.id}</Typography>
          <Typography className="patient-info">DOB: {patient.dob}</Typography>
          <Typography className="patient-info">
            Gender: {patient.gender}
          </Typography>
          <Typography className="patient-info">
            Contact: {patient.phone_number}
          </Typography>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="patient-profile-actions">
        <Button startIcon={<EditIcon />} style={{ color: "#007bff" }}>
          Edit Profile
        </Button>
        <Button startIcon={<DownloadIcon />}>Download Profile</Button>
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          style={{ color: "#007bff" }}
          onClick={handleDelete}
        >
          Delete Profile
        </Button>
      </div>

      {/* Tabs for Records */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Medical Records" icon={<MedicalServicesIcon />} />
          <Tab label="Prescriptions" icon={<MedicationIcon />} />
          <Tab label="Appointments" icon={<EventIcon />} />
          <Tab label="Billing Records" icon={<ReceiptIcon />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <div className="patient-records">
        {tabIndex === 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Diagnosis</TableCell>
                <TableCell>Prescription</TableCell>
                <TableCell>Lab Results</TableCell>
                <TableCell>Date Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.medical_records?.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.diagnosis || ""}</TableCell>
                  <TableCell>{record.prescription || ""}</TableCell>
                  <TableCell>{record.lab_results || ""}</TableCell>
                  <TableCell>{record.date_created || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {tabIndex === 1 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Prescription</TableCell>
                <TableCell>Date Issued</TableCell>
                <TableCell>Doctor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.prescriptions?.map((prescription, index) => (
                <TableRow key={index}>
                  <TableCell>{prescription.name || ""}</TableCell>
                  <TableCell>{prescription.date_issued || ""}</TableCell>
                  <TableCell>{prescription.doctor || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {tabIndex === 2 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Appointment Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Doctor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.appointments?.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>{appointment.date || ""}</TableCell>
                  <TableCell>{appointment.status || ""}</TableCell>
                  <TableCell>{appointment.doctor || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {tabIndex === 3 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Amount Due</TableCell>
                <TableCell>Amount Paid</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patient.billing_records?.map((bill, index) => (
                <TableRow key={index}>
                  <TableCell>{bill.invoice_date || ""}</TableCell>
                  <TableCell>{bill.amount_due || ""}</TableCell>
                  <TableCell>{bill.amount_paid || ""}</TableCell>
                  <TableCell>{bill.status || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;


import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientById } from "../api/patientService";
import { getBillingByPatientId } from "../api/billingService";
// import { updateMedicalRecord, deleteMedicalRecord } from "../api/medicalRecordService";

import "../styles/PatientProfile.css";
import AddMedicalRecordModal from "../components/AddMedicalRecordModal";

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [billingRecords, setBillingRecords] = useState([]);
  const [drugs, setDrugs] = useState({});



  const { userRole } = useContext(AuthContext);

  // Fetch patient data
  const fetchPatient = async () => {
    try {
      const patientData = await getPatientById(id);
      setPatient(patientData);
    } catch (error) {
      console.error("Error fetching patient data:", error.message);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchDrugs = async () => {
    try {
      const response = await fetch("/inventory"); // Update with your actual API
      const data = await response.json();
      const drugMap = data.reduce((acc, drug) => {
        acc[drug.id] = drug.name;
        return acc;
      }, {});
      setDrugs(drugMap);
    } catch (error) {
      console.error("Error fetching drug names:", error);
    }
  };
  
  useEffect(() => {
    fetchDrugs();
  }, []);

  useEffect(() => {
    if (tabIndex === 1) { // Assuming "Billing Records" is the second tab (index 1)
      const fetchBillingRecords = async () => {
        try {
          const data = await getBillingByPatientId(id);
          setBillingRecords(data);
        } catch (error) {
          console.error("Error fetching billing records:", error.message);
        }
      };
      fetchBillingRecords();
    }
  }, [tabIndex, id]);
  

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

   

  // Open and close modal functions
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
          <Typography variant="h5" className="patient-name">
            {`${patient?.first_name} ${patient.last_name}`}
          </Typography>
          <Typography className="patient-info">ID: {patient.id}</Typography>
          <Typography className="patient-info">DOB: {patient.dob}</Typography>
          <Typography className="patient-info">Gender: {patient.gender}</Typography>
          <Typography className="patient-info">Contact: {patient.phone_number}</Typography>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="patient-profile-actions">
        {userRole === "doctor" ? (
          <Button
            startIcon={<MedicalServicesIcon />}
            style={{ color: "#007bff" }}
            onClick={handleOpenModal}
          >
            Add Medical Record
          </Button>
        ) : (
          <Button startIcon={<EditIcon />} style={{ color: "#007bff" }}>
            Edit Profile
          </Button>
        )}
        <Button startIcon={<DownloadIcon />}>Download Profile Records</Button>
        {/* <Button
          color="error"
          startIcon={<DeleteIcon />}
          style={{ color: "#007bff" }}
          onClick={handleDelete}
        >
          Delete Profile
        </Button> */}

        {/* Add Medical Record Modal */}
        <AddMedicalRecordModal
          open={openModal}
          onClose={handleCloseModal}
          patientId={id}
          onSuccess={fetchPatient} // Update the list after adding
        />
      </div>

      {/* Tabs for Records */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Medical Records" icon={<MedicalServicesIcon />} />
          {/* <Tab label="Prescriptions" icon={<MedicationIcon />} /> */}
          {/* <Tab label="Appointments" icon={<EventIcon />} /> */}
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
                  {/* <TableCell>{record.prescription || ""}</TableCell> */}
                  
                  <TableCell>{drugs[record.prescription] || record.prescription || "N/A"}</TableCell>

                  {/* <TableCell>{record.lab_results || ""}</TableCell> */}
                  <TableCell>{record.lab_results || "No Lab Results"}</TableCell>

                  <TableCell>{record.date_created || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {/* {tabIndex === 1 && (
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
                  <TableCell>{prescription.doctor_name || ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )} */}

{tabIndex === 1 && (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Invoice No.</TableCell>
        <TableCell>Amount</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Date Issued</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {billingRecords.length > 0 ? (
        billingRecords.map((billing, index) => (
          <TableRow key={index}>
            <TableCell>{billing.invoice_number || "N/A"}</TableCell>
            <TableCell>{billing.amount || "N/A"}</TableCell>
            <TableCell>{billing.status || "Pending"}</TableCell>
            <TableCell>{billing.date_issued || "N/A"}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} align="center">
            No billing records found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
)}

        {/* {tabIndex === 2 && (
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
        )} */}
      </div>
    </div>
  );
};

export default PatientProfile;

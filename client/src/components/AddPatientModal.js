import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { addPatient } from "../api/patientService";

const AddPatientModal = ({ open, onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(""); // Use date input for DOB
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [doctor, setDoctor] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("dob", dob); // Format: YYYY-MM-DD
    formData.append("gender", gender);
    formData.append("phone_number", phoneNumber);
    formData.append("address", address);
    formData.append("medical_history", medicalHistory);
    formData.append("blood_group", bloodGroup);
    formData.append("allergies", allergies);
    formData.append("chronic_conditions", chronicConditions);
    formData.append("doctor", doctor);
    formData.append("image", image);

    try {
      await addPatient(formData);
      alert("Patient added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
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
          maxHeight: "80vh", // Limit the height to 80% of viewport height
          overflowY: "auto", // Enable vertical scrolling
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3>Add New Patient</h3>
        <TextField
          label="First Name"
          fullWidth
          margin="dense"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          fullWidth
          margin="dense"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Date of Birth"
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <InputLabel>Gender</InputLabel>
        <Select
          fullWidth
          margin="dense"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        <TextField
          label="Phone Number"
          fullWidth
          margin="dense"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField
          label="Address"
          fullWidth
          margin="dense"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Medical History"
          fullWidth
          margin="dense"
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
        />
        <TextField
          label="Blood Group"
          fullWidth
          margin="dense"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        />
        <TextField
          label="Allergies"
          fullWidth
          margin="dense"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
        />
        <TextField
          label="Chronic Conditions"
          fullWidth
          margin="dense"
          value={chronicConditions}
          onChange={(e) => setChronicConditions(e.target.value)}
        />
        <InputLabel>Assign Doctor</InputLabel>
        <Select
          fullWidth
          margin="dense"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        >
          <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
          <MenuItem value="Dr. Lee">Dr. Lee</MenuItem>
          <MenuItem value="Dr. Patel">Dr. Patel</MenuItem>
        </Select>
        <Button variant="contained" component="label" style={{ marginTop: "10px" }}>
          Upload Picture
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
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

export default AddPatientModal;

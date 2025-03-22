// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
// } from "@mui/material";
// import { addPatient, getAllDoctors } from "../api/patientService";

// const AddPatientModal = ({ open, onClose, onSuccess }) => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [dob, setDob] = useState(""); // Use date input for DOB
//   const [gender, setGender] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [address, setAddress] = useState("");
//   const [medicalHistory, setMedicalHistory] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [allergies, setAllergies] = useState("");
//   const [chronicConditions, setChronicConditions] = useState("");
//   const [doctorId, setDoctorId] = useState("");
//   const [image, setImage] = useState(null);
//   const [doctors, setDoctors] = useState([]);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const data = await getAllDoctors();
//         setDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctors:", error.message);
//       }
//     };
//     fetchDoctors();
//   }, []);

//   const handleFileChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append("first_name", firstName);
//     formData.append("last_name", lastName);
//     formData.append("dob", dob); // Format: YYYY-MM-DD
//     formData.append("gender", gender);
//     formData.append("phone_number", phoneNumber);
//     formData.append("address", address);
//     formData.append("medical_history", medicalHistory);
//     formData.append("blood_group", bloodGroup);
//     formData.append("allergies", allergies);
//     formData.append("chronic_conditions", chronicConditions);
//     formData.append("doctor", doctorId);
//     formData.append("image", image);

//     try {
//       await addPatient(formData);
//       alert("Patient added successfully!");
//       onSuccess();
//       onClose();
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <div
//         style={{
//           padding: "20px",
//           backgroundColor: "#fff",
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           width: "400px",
//           maxHeight: "80vh", // Limit the height to 80% of viewport height
//           overflowY: "auto", // Enable vertical scrolling
//           borderRadius: "8px",
//           boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h3>Add New Patient</h3>
//         <TextField
//           label="First Name"
//           fullWidth
//           margin="dense"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//         />
//         <TextField
//           label="Last Name"
//           fullWidth
//           margin="dense"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//         />
//         <TextField
//           label="Date of Birth"
//           type="date"
//           fullWidth
//           margin="dense"
//           InputLabelProps={{ shrink: true }}
//           value={dob}
//           onChange={(e) => setDob(e.target.value)}
//         />
//         <InputLabel>Gender</InputLabel>
//         <Select
//           fullWidth
//           margin="dense"
//           value={gender}
//           onChange={(e) => setGender(e.target.value)}
//         >
//           <MenuItem value="Male">Male</MenuItem>
//           <MenuItem value="Female">Female</MenuItem>
//           <MenuItem value="Other">Other</MenuItem>
//         </Select>
//         <TextField
//           label="Phone Number"
//           fullWidth
//           margin="dense"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//         />
//         <TextField
//           label="Address"
//           fullWidth
//           margin="dense"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//         />
//         <TextField
//           label="Medical History"
//           fullWidth
//           margin="dense"
//           value={medicalHistory}
//           onChange={(e) => setMedicalHistory(e.target.value)}
//         />
//         <TextField
//           label="Blood Group"
//           fullWidth
//           margin="dense"
//           value={bloodGroup}
//           onChange={(e) => setBloodGroup(e.target.value)}
//         />
//         <TextField
//           label="Allergies"
//           fullWidth
//           margin="dense"
//           value={allergies}
//           onChange={(e) => setAllergies(e.target.value)}
//         />
//         <TextField
//           label="Chronic Conditions"
//           fullWidth
//           margin="dense"
//           value={chronicConditions}
//           onChange={(e) => setChronicConditions(e.target.value)}
//         />
//         <InputLabel>Assign Doctor</InputLabel>
//         <Select
//           fullWidth
//           margin="dense"
//           value={doctorId}
//           onChange={(e) => setDoctorId(e.target.value)}
//         >
//           {doctors.map((doctor) => (
//             <MenuItem key={doctor.id} value={doctor.id}>
//               {doctor.username}
//             </MenuItem>
//           ))}
//         </Select>
//         <Button
//           variant="contained"
//           component="label"
//           style={{ marginTop: "10px" }}
//         >
//           Upload Picture
//           <input type="file" hidden onChange={handleFileChange} />
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           fullWidth
//           onClick={handleSubmit}
//           style={{ marginTop: "10px" }}
//         >
//           Save
//         </Button>
//         <Button
//           variant="outlined"
//           fullWidth
//           onClick={onClose}
//           style={{ marginTop: "5px" }}
//         >
//           Cancel
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default AddPatientModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { addPatient, getAllDoctors, updatePatient } from "../api/patientService";

const AddPatientModal = ({ open, onClose, onSuccess, editPatient }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [image, setImage] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Populate fields when editing an existing patient
  useEffect(() => {
    if (editPatient) {
      setFirstName(editPatient.first_name);
      setLastName(editPatient.last_name);
      setDob(editPatient.dob);
      setGender(editPatient.gender);
      setPhoneNumber(editPatient.phone_number);
      setAddress(editPatient.address);
      setMedicalHistory(editPatient.medical_history);
      setBloodGroup(editPatient.blood_group);
      setAllergies(editPatient.allergies);
      setChronicConditions(editPatient.chronic_conditions);
      setDoctorId(editPatient.doctor); // Assuming doctor ID is stored in patient data
    } else {
      clearForm();
    }
  }, [editPatient]);

  // Fetch doctors
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

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setDob("");
    setGender("");
    setPhoneNumber("");
    setAddress("");
    setMedicalHistory("");
    setBloodGroup("");
    setAllergies("");
    setChronicConditions("");
    setDoctorId("");
    setImage(null);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("phone_number", phoneNumber);
    formData.append("address", address);
    formData.append("medical_history", medicalHistory);
    formData.append("blood_group", bloodGroup);
    formData.append("allergies", allergies);
    formData.append("chronic_conditions", chronicConditions);
    formData.append("doctor", doctorId);
    formData.append("image", image);

    try {
      if (editPatient) {
        await updatePatient(editPatient.id, formData);
        alert("Patient updated successfully!");
      } else {
        await addPatient(formData);
        alert("Patient added successfully!");
      }
      clearForm();
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
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3>{editPatient ? "Edit Patient" : "Add New Patient"}</h3>
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
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        >
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.username}
            </MenuItem>
          ))}
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

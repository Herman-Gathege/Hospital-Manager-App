// // src/components/AddMedicalRecordModal.js
// import React, { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
// } from "@mui/material";
// import { createMedicalRecord } from "../api/medicalRecordService";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "8px",
// };

// const AddMedicalRecordModal = ({ open, onClose, patientId, onSuccess }) => {
//   const [diagnosis, setDiagnosis] = useState("");
//   const [prescription, setPrescription] = useState("");
//   const [labResults, setLabResults] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     console.log("Submitting medical record...");
//     console.log("Patient ID:", patientId);
//     console.log("Diagnosis:", diagnosis);
//     console.log("Prescription:", prescription);
//     console.log("Lab Results:", labResults);
  
//     try {
//       const response = await createMedicalRecord(patientId, diagnosis, prescription, labResults);
//       console.log("API Response:", response); // Check what the API returned
//       alert("Medical record added successfully!");
//       onSuccess(); // Refresh patient data
//       onClose(); // Close the modal
//     } catch (error) {
//       console.error("Error adding medical record:", error.message);
//       alert("Error adding medical record: " + error.message);
//     }
//   };
  

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         <Typography variant="h6" gutterBottom>
//           Add Medical Record
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Diagnosis"
//             value={diagnosis}
//             onChange={(e) => setDiagnosis(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Prescription"
//             value={prescription}
//             onChange={(e) => setPrescription(e.target.value)}
//             fullWidth
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Lab Results"
//             value={labResults}
//             onChange={(e) => setLabResults(e.target.value)}
//             fullWidth
//             margin="normal"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             style={{ marginTop: "16px" }}
//           >
//             Save Record
//           </Button>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AddMedicalRecordModal;

import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { createMedicalRecord } from "../api/medicalRecordService";
import { getAllInventory, updateInventoryItem } from "../api/inventoryService"; // Fixed imports
import { addBilling } from "../api/billingService"; // Fixed import

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
  const [unitsPrescribed, setUnitsPrescribed] = useState("");
  const [labResults, setLabResults] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const units = parseInt(unitsPrescribed, 10);
      if (isNaN(units) || units <= 0) {
        alert("Error: Please enter a valid number of units prescribed.");
        return;
      }
  
      // Fetch inventory and find the prescribed item
      const inventory = await getAllInventory();
      console.log("Fetched Inventory:", inventory); // Debugging log
  
      const inventoryItem = inventory.find(
        (item) => item.drug_name.toLowerCase() === prescription.toLowerCase()
      );
      console.log("Found Inventory Item:", inventoryItem); // Debugging log
  
      if (!inventoryItem) {
        alert(`Error: The prescribed item "${prescription}" is not in inventory.`);
        return;
      }
  
      if (inventoryItem.quantity < units) {
        alert(
          `Error: Not enough stock! Only ${inventoryItem.quantity} units are available.`
        );
        return;
      }
  
      // Deduct prescribed units from inventory
      const newQuantity = inventoryItem.quantity - units;
      await updateInventoryItem(inventoryItem.id, { quantity: newQuantity });
  
      // Create medical record
      await createMedicalRecord(patientId, diagnosis, prescription, unitsPrescribed, labResults);
  
      // Add billing entry based on units prescribed
      const billingData = {
        patientId,
        description: `Prescription: ${prescription} (${units} units)`,
        amount: inventoryItem.price * units,
        date: new Date().toISOString(),
      };
      await addBilling(billingData);
  
      alert("Medical record added successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding medical record:", error.message);
      alert("Error: " + error.message);
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
            label="Units Prescribed"
            type="number"
            value={unitsPrescribed}
            onChange={(e) => setUnitsPrescribed(e.target.value)}
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

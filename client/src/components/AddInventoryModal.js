
// import React, { useState, useEffect } from "react";
// import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
// import { addInventoryItem, updateInventoryItem } from "../api/inventoryService";

// const AddInventoryModal = ({ open, onClose, onSuccess, editItem }) => {
//   const [itemName, setItemName] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [supplier, setSupplier] = useState("");
//   const [cost, setCost] = useState("");

//   useEffect(() => {
//     if (editItem) {
//       setItemName(editItem.item_name);
//       setQuantity(editItem.quantity);
//       setSupplier(editItem.supplier);
//       setCost(editItem.cost);
//     } else {
//       setItemName("");
//       setQuantity("");
//       setSupplier("");
//       setCost("");
//     }
//   }, [editItem]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const inventoryData = { item_name: itemName, quantity, supplier, cost };
//       if (editItem) {
//         await updateInventoryItem(editItem.id, inventoryData);
//         alert("Item updated successfully!");
//       } else {
//         await addInventoryItem(inventoryData);
//         alert("Item added successfully!");
//       }
//       onSuccess();
//       onClose();
//     } catch (error) {
//       alert("Error saving item: " + error.message);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{editItem ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
//       <DialogContent>
//         <form onSubmit={handleSubmit}>
//           <TextField label="Item Name" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} required />
//           <TextField label="Quantity" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
//           <TextField label="Supplier" fullWidth value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
//           <TextField label="Cost" fullWidth value={cost} onChange={(e) => setCost(e.target.value)} required />
//           <Button type="submit" color="primary">{editItem ? "Update" : "Add"}</Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AddInventoryModal;

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { addInventoryItem, updateInventoryItem } from "../api/inventoryService";

const AddInventoryModal = ({ open, onClose, onSuccess, editItem }) => {
  const [drugName, setDrugName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [error, setError] = useState("");  // New error state

  useEffect(() => {
    if (editItem) {
      setDrugName(editItem.drug_name || "");
      setQuantity(editItem.quantity || "");
      setCost(editItem.cost || "");
      setExpirationDate(editItem.expiration_date || "");
    } else {
      setDrugName("");
      setQuantity("");
      setCost("");
      setExpirationDate("");
    }
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset errors

    // Validate input
    if (!drugName || !quantity || !cost || !expirationDate) {
      setError("All fields are required!");
      return;
    }
    if (quantity <= 0 || cost <= 0) {
      setError("Quantity and Cost must be positive numbers!");
      return;
    }

    try {
      const inventoryData = { 
        drug_name: drugName, 
        quantity: Number(quantity), 
        cost: Number(cost), 
        expiration_date: expirationDate  // Ensure correct format
      };

      if (editItem) {
        await updateInventoryItem(editItem.id, inventoryData);
      } else {
        await addInventoryItem(inventoryData);
      }

      onSuccess();  
      onClose();
    } catch (error) {
      setError(error.message || "Error saving item");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editItem ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}  {/* Display validation errors */}
          
          <TextField label="Drug Name" fullWidth value={drugName} onChange={(e) => setDrugName(e.target.value)} required />
          <TextField label="Quantity" type="number" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <TextField label="Cost" type="number" fullWidth value={cost} onChange={(e) => setCost(e.target.value)} required />
          <TextField label="Expiration Date" type="date" fullWidth value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required />
          
          <Button type="submit" color="primary" variant="contained" style={{ marginTop: "10px" }}>
            {editItem ? "Update" : "Add"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryModal;

// import React, { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
// } from "@mui/material";
// import { createInventory } from "../api/inventoryService";

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

// const AddInventoryModal = ({ open, onClose }) => {
//   const [name, setName] = useState("");
//   const [quantity, setQuantity] = useState(0);
//   const [price, setPrice] = useState(0);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await createInventory(name, quantity, price);
//       onClose();
//     } catch (error) {
//       console.error("Error adding inventory:", error.message);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         <Typography variant="h6" component="h2">
//           Add Inventory
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Item Name"
//             fullWidth
//             margin="normal"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <TextField
//             label="Quantity"
//             type="number"
//             fullWidth
//             margin="normal"
//             value={quantity}
//             onChange={(e) => setQuantity(e.target.value)}
//           />
//           <TextField
//             label="Price"
//             type="number"
//             fullWidth
//             margin="normal"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//           />
//           <Button type="submit" variant="contained" color="primary">
//             Add
//           </Button>
//         </form>
//       </Box>
//     </Modal>
//   );
// };

// export default AddInventoryModal;

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { addInventoryItem, updateInventoryItem } from "../api/inventoryService";

const AddInventoryModal = ({ open, onClose, onSuccess, editItem }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    if (editItem) {
      setItemName(editItem.item_name);
      setQuantity(editItem.quantity);
      setSupplier(editItem.supplier);
    } else {
      setItemName("");
      setQuantity("");
      setSupplier("");
    }
  }, [editItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inventoryData = { item_name: itemName, quantity, supplier };
      if (editItem) {
        await updateInventoryItem(editItem.id, inventoryData);
        alert("Item updated successfully!");
      } else {
        await addInventoryItem(inventoryData);
        alert("Item added successfully!");
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error saving item: " + error.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editItem ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField label="Item Name" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <TextField label="Quantity" fullWidth value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
          <TextField label="Supplier" fullWidth value={supplier} onChange={(e) => setSupplier(e.target.value)} required />
          <Button type="submit" color="primary">{editItem ? "Update" : "Add"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryModal;

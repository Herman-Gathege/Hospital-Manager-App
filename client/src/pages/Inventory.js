

import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../context/AuthContext";
import AddInventoryModal from "../components/AddInventoryModal";
import { getAllInventory, deleteInventoryItem } from "../api/inventoryService";
import "../styles/Inventory.css"; // Ensure styles are applied

const Inventory = () => {
  const [search, setSearch] = useState("");
  const { username } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  // Fetch inventory items from API
  const fetchInventory = async () => {
    try {
      const data = await getAllInventory();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error.message);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Open modal for adding/editing inventory
  const handleOpenModal = (item = null) => {
    setEditItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditItem(null);
  };

  // Handle delete inventory item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteInventoryItem(id);
        alert("Item deleted successfully!");
        fetchInventory();
      } catch (error) {
        alert("Error deleting item: " + error.message);
      }
    }
  };

  return (
    <div className="inventory-container">
      {/* Greeting and Search Bar */}
      <div className="inventory-greeting">
        <h2>Hello, {username}! You can manage inventory here.</h2>

        <input
          type="text"
          placeholder="Search inventory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="inventory-search-bar"
        />
      </div>

      {/* Add Inventory Button */}
      <div className="inventory-links">
        <Button 
        onClick={() => handleOpenModal()} style={{ color: "#007bff" }}>
          Add New Item
        </Button>
      </div>

      {/* Inventory Table
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              className="blue-text"
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Item Name
            </TableCell>
            <TableCell
              className="blue-text"
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Actions
            </TableCell>
            <TableCell
              className="blue-text"
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Quantity
            </TableCell>
            <TableCell
              className="blue-text"
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Supplier
            </TableCell>
            <TableCell
              className="blue-text"
              style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
            >
              Last Updated
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.item_name || "N/A"}</TableCell>
              <TableCell>{item.quantity || "N/A"}</TableCell>
              <TableCell>{item.supplier || "N/A"}</TableCell>
              <TableCell>
                {new Date(item.last_updated).toLocaleDateString() || "N/A"}
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => handleOpenModal(item)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}

      {/* Inventory Table */}
<Table>
  <TableHead>
    <TableRow>
      <TableCell
        className="blue-text"
        style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
      >
        Item Name
      </TableCell>
      <TableCell
        className="blue-text"
        style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
      >
        Quantity
      </TableCell>
      <TableCell
        className="blue-text"
        style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
      >
        Supplier
      </TableCell>
      <TableCell
        className="blue-text"
        style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
      >
        Last Updated
      </TableCell>
      <TableCell
        className="blue-text"
        style={{ color: "#007bff", fontWeight: "bold", fontSize: "12px" }}
      >
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {inventory.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.item_name || "N/A"}</TableCell>
        <TableCell>{item.quantity || "N/A"}</TableCell>
        <TableCell>{item.supplier || "N/A"}</TableCell>
        <TableCell>{new Date(item.last_updated).toLocaleDateString() || "N/A"}</TableCell>
        <TableCell>
          <IconButton color="primary" onClick={() => handleOpenModal(item)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(item.id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


      {/* Add Inventory Modal */}
      <AddInventoryModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={fetchInventory}
        editItem={editItem}
      />
    </div>
  );
};

export default Inventory;

import React, { useState, useContext } from "react";
import { Link,  useLocation } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
// import ReportIcon from "@mui/icons-material/Assessment";
// import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();
    const { handleLogout } = useContext(AuthContext); // Use the context's handleLogout

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
        { text: "Patients", path: "/dashboard/patients", icon: <PersonIcon /> },
        { text: "Appointments", path: "/dashboard/appointments", icon: <CalendarMonthIcon /> },
        // { text: "Medical Records", path: "/medical-records", icon: <MedicalServicesIcon /> },
        { text: "Billing", path: "/dashboard/billing", icon: <ReceiptIcon /> },
        // { text: "Staff Management", path: "/dashboard/staff", icon: <GroupIcon /> },
        { text: "Inventory", path: "/dashboard/inventory", icon: <InventoryIcon /> },
        // { text: "Reports", path: "/reports", icon: <ReportIcon /> },
        // { text: "Settings", path: "/settings", icon: <SettingsIcon /> },

    ];

    return (
        <>
            <IconButton onClick={toggleDrawer} style={{ position: "fixed", top: 10, left: 10 }}>
                <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer variant="persistent" open={open} anchor="left" onClose={toggleDrawer}>
            <div style={{ width: 250, padding: 20, backgroundColor: "#EEF7FE" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"  }}>
                        <Typography variant="h6" style={{ marginBottom: 20 }}>
                            Hospital Dashboard
                        </Typography>
                        <IconButton onClick={toggleDrawer}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                component={Link}
                                to={item.path}
                                // onClick={toggleDrawer}
                                style={{
                                    backgroundColor: location.pathname === item.path ? "#0095FF" : "transparent",
                                    color: location.pathname === item.path ? "#EEF7FE" : "#333",
                                    fontWeight: location.pathname === item.path ? "bold" : "normal",
                                }}
                            >
                                {item.icon}
                                <ListItemText primary={item.text} style={{ marginLeft: 10 }} />
                            </ListItem>
                        ))}
                        <Divider />
                        <ListItem button onClick={handleLogout}>
                            <LogoutIcon />
                            <ListItemText primary="Logout" style={{ marginLeft: 10, cursor: "pointer" }} />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </>
    );
};

export default Sidebar;

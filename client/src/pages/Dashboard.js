import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddPatientModal from "../components/AddPatientModal";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  getOverviewStats,
  getPatientStats,
  getAppointmentStats,
  getBillingStats,
  getInventoryStats,
} from "../api/dashboardService";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { Button } from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const { userRole, username, handleLogout } = useContext(AuthContext);
  //   const [username] = useState(localStorage.getItem("username") || "User");
  const [search, setSearch] = useState("");
  const [overview, setOverview] = useState({});
  const [patientStats, setPatientStats] = useState({});
  const [appointmentStats, setAppointmentStats] = useState({});
  const [billingStats, setBillingStats] = useState({});
  const [inventoryStats, setInventoryStats] = useState({});
  const [patientData, setPatientData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Overview Stats
        const overviewData = await getOverviewStats();
        setOverview(overviewData);

        // Fetch Patient Stats
        const patientData = await getPatientStats();
        setPatientStats(patientData);

        // Prepare patient data for BarChart (e.g., monthly registration count)
        const patientChartData = patientData.recent_patients.map((patient) => ({
          month: new Date(patient.check_in_date).toLocaleString("default", {
            month: "short",
          }),
          count: 1, // each patient is counted as 1 for the month
        }));

        // Aggregate patient data by month
        const aggregatedPatientData = patientChartData.reduce(
          (acc, current) => {
            const existing = acc.find((item) => item.month === current.month);
            if (existing) {
              existing.count += 1;
            } else {
              acc.push(current);
            }
            return acc;
          },
          []
        );
        setPatientData(aggregatedPatientData);

        // Fetch Appointment Stats
        const appointmentData = await getAppointmentStats();
        setAppointmentStats(appointmentData);

        // Fetch Billing Stats
        const billingData = await getBillingStats();
        setBillingStats(billingData);

        // Prepare revenue data for LineChart (dynamically calculated)
        const revenueChartData = Array.from({ length: 12 }, (_, index) => {
          const monthName = new Date(0, index).toLocaleString("default", {
            month: "short",
          });
          const monthRevenue = (
            billingData.monthly_revenues?.[index] || 0
          ).toFixed(2);
          return { month: monthName, revenue: parseFloat(monthRevenue) };
        });
        setRevenueData(revenueChartData);

        // Fetch Inventory Stats
        const inventoryData = await getInventoryStats();
        setInventoryStats(inventoryData);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  if (!userRole) {
    return <p>Loading dashboard...</p>;
  }

  // Prepare Appointment Data for PieChart
  const appointmentData = [
    { name: "Completed", value: appointmentStats.completed_count || 0 },
    { name: "Scheduled", value: appointmentStats.scheduled_count || 0 },
    { name: "Canceled", value: appointmentStats.canceled_count || 0 },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
        </h1>

        {/* Greeting and Search Bar */}
        <div className="greeting">
          <h2>Hello, {username} what are you looking for?</h2>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Functional Links */}
        <div className="buttons-container">
          <Button
            startIcon={<PersonAddIcon />}
            onClick={handleOpenModal}
            style={{ color: "#007bff" }}
          >
            Register New Patient
          </Button>
          <Link to="/schedule-appointment" className="text-link">
            Schedule Appointment
          </Link>
          <Link to="/generate-report" className="text-link">
            Generate Report
          </Link>
        </div>

        {/* Three-Column Widget */}
        <div className="overview-container">
          <div
            className="widget"
            onClick={() => navigate("/dashboard/patients")}
            style={{ cursor: "pointer" }}
          >
            Total Registered Patients: {overview.total_patients}
          </div>
          <div className="widget"
          onClick={() => navigate("/dashboard/appointments")}
          style={{ cursor: "pointer" }}>
            Appointments: {overview.total_appointments}
          </div>
          <div className="widget">
            Available Doctors: {overview.available_doctors}
          </div>
          <div className="widget">
            Total Revenue: ${overview.total_revenue?.toFixed(2)}
          </div>
        </div>

        {/* Visualization Widgets */}
        <div className="charts-container">
          {/* Bar Chart */}
          <div className="chart">
            <h3 className="chart-title">Total Registered Patients</h3>
            <BarChart width={300} height={200} data={patientData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </div>

          {/* Pie Chart */}
          <div className="chart">
            <h3 className="chart-title">Appointments Breakdown</h3>
            <PieChart width={300} height={200}>
              <Pie
                data={appointmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {appointmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Line Chart */}
          <div className="chart">
            <h3 className="chart-title">Revenue Over Time</h3>
            <LineChart
              width={600}
              height={300}
              data={revenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="month" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>

        <Outlet />
      </div>
      <AddPatientModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={() => console.log("Patient Added")}
      />
    </div>
  );
};

export default Dashboard;

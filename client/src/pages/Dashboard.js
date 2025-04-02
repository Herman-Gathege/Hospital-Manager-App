// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import AddPatientModal from "../components/AddPatientModal";
// import { Outlet } from "react-router-dom";
// import {
//   getOverviewStats,
//   getPatientStats,
//   getAppointmentStats,
//   getBillingStats,
//   getInventoryStats,
// } from "../api/dashboardService";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";

// import { Button } from "@mui/material";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useNavigate } from "react-router-dom";

// import "../styles/Dashboard.css";

// const Dashboard = () => {
//   const { userRole, username, handleLogout } = useContext(AuthContext);
//   //   const [username] = useState(localStorage.getItem("username") || "User");
//   const [search, setSearch] = useState("");
//   const [overview, setOverview] = useState({});
//   const [patientStats, setPatientStats] = useState({});
//   const [appointmentStats, setAppointmentStats] = useState({});
//   const [billingStats, setBillingStats] = useState({});
//   const [inventoryStats, setInventoryStats] = useState({});
//   const [patientData, setPatientData] = useState([]);
//   const [revenueData, setRevenueData] = useState([]);
//   const [openModal, setOpenModal] = useState(false);

//   const navigate = useNavigate();

//   const handleOpenModal = () => {
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         // Fetch Overview Stats
//         const fetchStats = async () => {
//           try {
//             const overviewData = await getOverviewStats();
//             console.log("Overview Data:", overviewData);
//             setOverview(overviewData);
//           } catch (err) {
//             console.error("Error fetching overview stats:", err);
//           }
//         };
//         fetchStats();

//         // Fetch Patient Stats
//         const patientData = await getPatientStats();
//         setPatientStats(patientData);

//         // Prepare patient data for BarChart (e.g., monthly registration count)
//         const patientChartData = patientData.recent_patients.map((patient) => ({
//           month: new Date(patient.check_in_date).toLocaleString("default", {
//             month: "short",
//           }),
//           count: 1, // each patient is counted as 1 for the month
//         }));

//         // Aggregate patient data by month
//         const aggregatedPatientData = patientChartData.reduce(
//           (acc, current) => {
//             const existing = acc.find((item) => item.month === current.month);
//             if (existing) {
//               existing.count += 1;
//             } else {
//               acc.push(current);
//             }
//             return acc;
//           },
//           []
//         );
//         setPatientData(aggregatedPatientData);

//         // Fetch Appointment Stats
//         const appointmentData = await getAppointmentStats();
//         setAppointmentStats(appointmentData);

//         const billingData = await getBillingStats();
//         console.log("Billing Data:", billingData); // Debugging

//         const paidBills =
//           billingData.bills?.filter((bill) => bill.status === "paid") || [];
//         console.log("Paid Bills:", paidBills); // Debugging

//         const totalRevenue = paidBills.reduce(
//           (sum, bill) => sum + (bill.amount || 0),
//           0
//         );
//         console.log("Total Revenue:", totalRevenue); // Debugging

//         const revenueChartData = Array.from({ length: 12 }, (_, index) => {
//           const monthName = new Date(0, index).toLocaleString("default", {
//             month: "short",
//           });

//           const monthRevenue = paidBills
//             .filter((bill) => {
//               const billMonth = new Date(bill.date).getMonth();
//               return billMonth === index;
//             })
//             .reduce((sum, bill) => sum + (bill.amount || 0), 0);

//           return { month: monthName, revenue: monthRevenue };
//         });

//         console.log("Revenue Chart Data:", revenueChartData); // Debugging

//         setBillingStats({ ...billingData, totalRevenue });
//         setRevenueData(revenueChartData);

//         // Fetch Inventory Stats
//         const inventoryData = await getInventoryStats();
//         setInventoryStats(inventoryData);
//       } catch (err) {
//         console.error("Error fetching dashboard stats:", err.message);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (!userRole) {
//     return <p>Loading dashboard...</p>;
//   }

//   // Prepare Appointment Data for PieChart
//   const appointmentData = [
//     { name: "Completed", value: appointmentStats.completed_count || 0 },
//     { name: "Scheduled", value: appointmentStats.scheduled_count || 0 },
//     { name: "Canceled", value: appointmentStats.canceled_count || 0 },
//   ];

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-content">
//         <h1>
//           {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
//         </h1>

//         {/* Greeting and Search Bar */}
//         <div className="greeting">
//           <h2>Hello, {username} what are you looking for?</h2>
//           <input
//             type="text"
//             placeholder="Search..."
//             className="search-bar"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* Functional Links */}
//         <div className="buttons-container">
//           <Button
//             startIcon={<PersonAddIcon />}
//             onClick={handleOpenModal}
//             style={{ color: "#007bff" }}
//           >
//             Register New Patient
//           </Button>
//         </div>

//         {/* Three-Column Widget */}
//         <div className="overview-container">
//           <div
//             className="widget"
//             onClick={() => navigate("/dashboard/patients")}
//             style={{ cursor: "pointer" }}
//           >
//             Total Registered Patients: {overview.total_patients}
//           </div>
//           <div
//             className="widget"
//             onClick={() => navigate("/dashboard/appointments")}
//             style={{ cursor: "pointer" }}
//           >
//             Appointments: {overview.total_appointments}
//           </div>
//           <div className="widget">
//             Available Doctors: {overview.available_doctors}
//           </div>
//           <div className="widget">
//             Total Revenue: ${billingStats.totalRevenue?.toFixed(2)}
//           </div>
//         </div>

//         {/* Visualization Widgets */}
//         <div className="charts-container">
//           {/* Bar Chart */}
//           <div className="chart">
//             <h3 className="chart-title">Total Registered Patients</h3>
//             <BarChart width={300} height={200} data={patientData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#82ca9d" />
//             </BarChart>
//           </div>

//           {/* Pie Chart */}
//           <div className="chart">
//             <h3 className="chart-title">Appointments Breakdown</h3>
//             <PieChart width={300} height={200}>
//               <Pie
//                 data={appointmentData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 fill="#8884d8"
//                 label
//               >
//                 {appointmentData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </div>

//           {/* Line Chart */}
//           <div className="chart">
//             <h3 className="chart-title">Revenue Over Time</h3>
//             <LineChart width={600} height={300} data={revenueData}>
//               <XAxis dataKey="month" interval={0} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
//             </LineChart>
//           </div>
//         </div>

//         <Outlet />
//       </div>
//       <AddPatientModal
//         open={openModal}
//         onClose={handleCloseModal}
//         onSuccess={() => console.log("Patient Added")}
//       />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddPatientModal from "../components/AddPatientModal";
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
        const overviewData = await getOverviewStats();
        console.log("Overview Data:", overviewData);
        setOverview(overviewData);

        const patientData = await getPatientStats();
        setPatientStats(patientData);

        const patientChartData = patientData.recent_patients.map((patient) => ({
          month: new Date(patient.check_in_date).toLocaleString("default", {
            month: "short",
          }),
          count: 1,
        }));

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

        const appointmentData = await getAppointmentStats();
        setAppointmentStats(appointmentData);

        const billingData = await getBillingStats();
        const paidBills = billingData.bills?.filter((bill) => bill.status === "paid") || [];
        if (paidBills.length === 0) {
          console.log("No paid bills found");
        }
                const totalRevenue = paidBills.reduce(
          (sum, bill) => sum + (bill.amount || 0),
          0
        );

        const revenueChartData = Array.from({ length: 12 }, (_, index) => {
          const monthName = new Date(0, index).toLocaleString("default", { month: "short" });
          const monthRevenue = paidBills
            .filter((bill) => new Date(bill.date).getMonth() === index)
            .reduce((sum, bill) => sum + (bill.amount || 0), 0);
          return { month: monthName, revenue: monthRevenue };
        });

        setBillingStats({ ...billingData, totalRevenue });
        setRevenueData(revenueChartData);

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

        <div className="buttons-container">
          <Button
            startIcon={<PersonAddIcon />}
            onClick={handleOpenModal}
            style={{ color: "#007bff" }}
          >
            Register New Patient
          </Button>
        </div>

        <div className="overview-container">
          <div
            className="widget"
            onClick={() => navigate("/dashboard/patients")}
            style={{ cursor: "pointer" }}
          >
            Total Registered Patients: {overview.total_patients}
          </div>
          <div
            className="widget"
            onClick={() => navigate("/dashboard/appointments")}
            style={{ cursor: "pointer" }}
          >
            Appointments: {overview.total_appointments}
          </div>
          <div className="widget">
            Available Doctors: {overview.available_doctors}
          </div>
          <div className="widget">
            Total Revenue: ${billingStats.totalRevenue?.toFixed(2)}
          </div>
        </div>

        <div className="charts-container">
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="chart">
            <h3 className="chart-title">Revenue Over Time</h3>
            <LineChart width={600} height={300} data={revenueData}>
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

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// // Layouts
// import VolunteerLayout from "./Layouts/VolunteerLayout";
// import AdminLayout from "./Layouts/AdminLayout";
// import CitizenLayout from "./Layouts/CitizenLayout";

// // Volunteer pages
// import Dashboard from "./pages/volunteer/Dashboard";
// import MissionsList from "./pages/volunteer/MissionsList";
// import MissionDetails from "./pages/volunteer/MissionDetails";
// import ReportIncident from "./pages/volunteer/ReportIncident";
// import Profile from "./pages/volunteer/Profile";
// import VolunteerLogin from "./pages/volunteer/VolunteerLogin";
// import VolunteerRegister from "./pages/volunteer/VolunteerRegister";
// import Training from "./pages/volunteer/Training";

// // Admin pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import TeamAssignment from "./pages/admin/TeamAssignment";
// import BroadcastCenter from "./pages/admin/BroadcastCenter";
// import IncidentDetails from "./pages/admin/IncidentDetails";
// import AdminLogin from "./pages/admin/AdminLogin";
// import IncidentLog from "./pages/admin/IncidentLog";
// import ReliefOps from "./pages/admin/ReliefOps";
// import AdminSOS from "./pages/admin/AdminSOS";


// // Citizen pages
// import CitizenLogin from "./pages/citizen/CitizenLogin";
// import CitizenRegister from "./pages/citizen/CitizenRegister";
// import CitizenReport from "./pages/citizen/CitizenReport";
// import CitizenIncidents from "./pages/citizen/CitizenIncidents";
// import CitizenAlerts from "./pages/citizen/CitizenAlert";
// import CitizenRelief from "./pages/citizen/CitizenRelief";

// import SOSbutton from "./components/SOSbutton";


// // General
// import Home from "./pages/Home";
// import NotFound from "./pages/NotFound";

// export default function App() {
//   return (
//     <BrowserRouter>
//       {/* GLOBAL THEME WRAPPER */}
//       <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white">
//         <Routes>

//           {/* HOME PAGE */}
//           <Route path="/" element={<Home />} />

//           {/* 🔹 Independent Auth Routes */}
//           <Route path="/citizen/login" element={<CitizenLogin />} />
//           <Route path="/citizen/register" element={<CitizenRegister />} />

//           <Route path="/volunteer/login" element={<VolunteerLogin />} />
//           <Route path="/volunteer/register" element={<VolunteerRegister />} />
//           <Route path="/admin/login" element={<AdminLogin />} />

//           {/* 🔹 Citizen Dashboard Area */}
//           <Route path="/citizen" element={<CitizenLayout />}>
//             <Route index element={<Navigate to="report" replace />} />
//             <Route path="report" element={<CitizenReport />} />
//             <Route path="relief" element={<CitizenRelief />} />
//             <Route path="incidents" element={<CitizenIncidents />} />
//             <Route path="alerts" element={<CitizenAlerts />} />
//           </Route>

//           {/* 🔹 Volunteer Dashboard Area */}
//           <Route path="/volunteer" element={<VolunteerLayout />}>
//             <Route index element={<Dashboard />} />
//             <Route path="missions" element={<MissionsList />} />
//             <Route path="missions/:id" element={<MissionDetails />} />
//             <Route path="report" element={<ReportIncident />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="training" element={<Training />} />
//           </Route>

//           {/* 🔹 Admin Dashboard Area */}
//           <Route path="/admin" element={<AdminLayout />}>
//             <Route index element={<AdminDashboard />} />
//             <Route path="teams" element={<TeamAssignment />} />
//             <Route path="incidents" element={<IncidentLog />} />
//             <Route path="broadcast" element={<BroadcastCenter />} />
//             {/* <Route path="/admin/incidents" element={<AdminIncidents />} /> */}
//             <Route path="incidents/:id" element={<IncidentDetails />} />
//             <Route path="relief" element={<ReliefOps />} />
//             <Route path="sos" element={<AdminSOS />} />
//           </Route>

//           {/* 🔹 404 Catch-All Route */}
//           <Route path="*" element={<NotFound />} />

//         </Routes>
//       </div>
//       <SOSbutton />
//     </BrowserRouter>


//   );
// }

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import VolunteerLayout from "./Layouts/VolunteerLayout";
import AdminLayout from "./Layouts/AdminLayout";
import CitizenLayout from "./Layouts/CitizenLayout";

// Volunteer pages
import Dashboard from "./pages/volunteer/Dashboard";
import MissionsList from "./pages/volunteer/MissionsList";
import IncidentDetails from "./pages/volunteer/IncidentDetails";
import ReportIncident from "./pages/volunteer/ReportIncident";
import Profile from "./pages/volunteer/Profile";
import VolunteerLogin from "./pages/volunteer/VolunteerLogin";
import VolunteerRegister from "./pages/volunteer/VolunteerRegister";
import Training from "./pages/volunteer/Training";
import Broadcasts from "./pages/volunteer/Broadcasts";
import VolunteerIncidentDetails from "./pages/volunteer/IncidentDetails";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeamAssignment from "./pages/admin/TeamAssignment";
import BroadcastCenter from "./pages/admin/BroadcastCenter";
import AdminIncidentDetails from "./pages/admin/IncidentDetails";
import AdminLogin from "./pages/admin/AdminLogin";
import IncidentLog from "./pages/admin/IncidentLog";
import AdminSOS from "./pages/admin/AdminSOS";
import AdminIncidents from "./pages/admin/AdminIncidents";

// Citizen pages
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenReport from "./pages/citizen/CitizenReport";
import CitizenIncidents from "./pages/citizen/CitizenIncidents";
import CitizenAlerts from "./pages/citizen/CitizenAlert";
import CitizenRelief from "./pages/citizen/CitizenRelief";

import SOSbutton from "./components/SOSbutton";

// General
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Donate from "./components/Donate";

export default function App() {
  return (
    <BrowserRouter>
      {/* GLOBAL THEME WRAPPER */}
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white">
        <Routes>
          {/* HOME PAGE */}
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<Donate />} />

          {/* 🔹 Independent Auth Routes */}
          <Route path="/citizen/login" element={<CitizenLogin />} />
          <Route path="/citizen/register" element={<CitizenRegister />} />

          <Route path="/volunteer/login" element={<VolunteerLogin />} />
          <Route path="/volunteer/register" element={<VolunteerRegister />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔹 Citizen Dashboard Area */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<Navigate to="report" replace />} />
            <Route path="report" element={<CitizenReport />} />
            <Route path="relief" element={<CitizenRelief />} />
            <Route path="incidents" element={<CitizenIncidents />} />
            <Route path="alerts" element={<CitizenAlerts />} />
          </Route>

          {/* 🔹 Volunteer Dashboard Area */}
          <Route path="/volunteer" element={<VolunteerLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="missions" element={<MissionsList />} />
            <Route path="incidents/:id" element={<VolunteerIncidentDetails />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="profile" element={<Profile />} />
            <Route path="training" element={<Training />} />
            <Route path="broadcasts" element={<Broadcasts />} />
          </Route>

          {/* 🔹 Admin Command Center */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Default: SOS Control Panel (Most Critical) */}
            <Route index element={<Navigate to="sos" replace />} />

            <Route path="sos" element={<AdminSOS />} />

            {/* Live Incidents List (with tabs for Citizen/Volunteer) */}
            <Route path="incidents" element={<AdminIncidents />} />

            {/* Incident Details */}
            <Route path="incidents/:id" element={<AdminIncidentDetails />} />

            {/* Team Operations */}
            <Route path="teams" element={<TeamAssignment />} />

            {/* Alert Broadcasts */}
            <Route path="broadcast" element={<BroadcastCenter />} />

            {/* Optional: Full Incident Log (table view) */}
            <Route path="log" element={<IncidentLog />} />
          </Route>

          {/* 🔹 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes >
      </div >

      {/* Global Floating SOS Button */}
      < SOSbutton />
    </BrowserRouter >
  );
}
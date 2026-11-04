// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// const connectDB = require("./config/db");

// // Auth middleware
// const {
//   protect,
//   protectAdmin,
//   protectVolunteer,
//   protectCitizen,
// } = require("./middleware/auth");

// // Routes
// const citizenAuthRoutes = require("./routes/citizenAuthRoutes");
// const citizenIncidentRoutes = require("./routes/citizenIncidentRoutes");
// const citizenAlertRoutes = require("./routes/citizenAlertRoutes");

// // Volunteer Routes
// const volunteerAuthRoutes = require("./routes/volunteerAuthRoutes"); // 👈 NEW IMPORT
// const volunteerRoutes = require("./routes/volunteerRoutes");
// const volunteerAlertRoutes = require("./routes/volunteerAlertRoutes");

// const missionRoutes = require("./routes/missionRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const reportRoutes = require("./routes/reportRoutes");
// const incidentNoteRoutes = require("./routes/incidentNoteRoutes");
// const citizenOtpRoutes = require("./routes/citizenOtpRoutes");

// const sosRoutes = require("./routes/sosRoutes");


// // App
// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(morgan("dev"));
// connectDB();

// // ---------------- CITIZEN ROUTES ----------------
// app.use("/api/citizen/auth", citizenAuthRoutes); 
// app.use("/api/citizen/incidents", protect, protectCitizen, citizenIncidentRoutes);
// app.use("/api/citizen/alerts", protect, protectCitizen, citizenAlertRoutes);
// app.use("/api/citizen/otp", citizenOtpRoutes); 

// // ---------------- VOLUNTEER ROUTES --------------
// // 🔹 NEW: Public Auth Routes (Register/Login)
// app.use("/api/volunteer/auth", volunteerAuthRoutes); 

// // Protected Routes (Dashboard, Missions, etc.)
// app.use("/api/volunteer", protect, protectVolunteer, volunteerRoutes);
// app.use("/api/volunteer/alerts", protect, protectVolunteer, volunteerAlertRoutes);
// app.use("/api/missions", protect, protectVolunteer, missionRoutes);
// app.use("/api/reports", protect, protectVolunteer, reportRoutes);

// // ---------------- ADMIN ROUTES ------------------
// app.use("/api/admin", adminRoutes); 
// app.use("/api/admin/notes", protect, protectAdmin, incidentNoteRoutes);
// app.use("/api/sos", sosRoutes);


// // Run server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));

require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Auth middleware
const {
  protect,
  protectAdmin,
  protectVolunteer,
  protectCitizen,
} = require("./middleware/auth");

// Routes
const citizenAuthRoutes = require("./routes/citizenAuthRoutes");
const citizenIncidentRoutes = require("./routes/citizenIncidentRoutes");
const citizenAlertRoutes = require("./routes/citizenAlertRoutes");
const citizenOtpRoutes = require("./routes/citizenOtpRoutes");

// Volunteer Routes
const volunteerAuthRoutes = require("./routes/volunteerAuthRoutes"); // Auth (send-otp, register, login)
const volunteerRoutes = require("./routes/volunteerRoutes"); // Profile, dashboard, missions, etc.
const volunteerAlertRoutes = require("./routes/volunteerAlertRoutes"); // New: Alerts (get)

const missionRoutes = require("./routes/missionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const incidentNoteRoutes = require("./routes/incidentNoteRoutes");
const sosRoutes = require("./routes/sosRoutes");

const app = express();

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin is not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ---------------- CITIZEN ROUTES ----------------
app.use("/api/citizen/auth", citizenAuthRoutes); // Public: register, login
app.use("/api/citizen/incidents", protect, protectCitizen, citizenIncidentRoutes);
app.use("/api/citizen/alerts", protect, citizenAlertRoutes);
app.use("/api/citizen/otp", citizenOtpRoutes); // Public: send, verify

// ---------------- VOLUNTEER ROUTES --------------
app.use("/api/volunteer/auth", volunteerAuthRoutes); // Public: send-otp, register, login

// Protected Routes (Profile, Dashboard, Missions, Reports)
app.use("/api/volunteer", protect, protectVolunteer, volunteerRoutes);
app.use("/api/volunteer/alerts", protect, protectVolunteer, volunteerAlertRoutes); // Alerts
app.use("/api/missions", protect, protectVolunteer, missionRoutes);
app.use("/api/reports", protect, protectVolunteer, reportRoutes);

// ---------------- ADMIN ROUTES ------------------
app.use("/api/admin", adminRoutes); // Includes public login and protected routes
app.use("/api/admin/notes", protect, protectAdmin, incidentNoteRoutes);

// ---------------- OTHER ROUTES ------------------
app.use("/api/sos", sosRoutes); // Public SOS

// Run server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
});
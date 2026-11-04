const jwt = require("jsonwebtoken");
const Citizen = require("../models/Citizen");
const Volunteer = require("../models/Volunteer");
const Admin = require("../models/Admin");

exports.protect = async (req, res, next) => {
  try {
    const raw = req.headers.authorization;
    if (!raw || !raw.startsWith("Bearer "))
      return res.status(401).json({ message: "No token" });

    const token = raw.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔹 FIX: Check for the Hardcoded Admin ID FIRST
    // If we don't do this, the database query below will fail
    if (decoded.id === "admin-fixed-id") {
      req.user = { id: "admin-fixed-id", role: "admin" };
      req.role = "admin";
      return next(); // Skip database check and proceed
    }
    // -----------------------------------------------------

    // Database Lookup (Only runs for Citizens/Volunteers)
    let user =
      (await Citizen.findById(decoded.id)) ||
      (await Volunteer.findById(decoded.id)) ||
      (await Admin.findById(decoded.id));

    if (!user) return res.status(401).json({ message: "Invalid token: User not found" });

    req.user = user;

    // Assign roles dynamically based on the found user
    if (user.role === "admin") req.role = "admin";
    else if (user.skills || user.role === "volunteer") req.role = "volunteer";
    else req.role = "citizen";

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Unauthorized: Token failed" });
  }
};

exports.protectAdmin = (req, res, next) => {
  if (req.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};

exports.protectVolunteer = (req, res, next) => {
  if (req.role !== "volunteer") return res.status(403).json({ message: "Volunteer only" });
  next();
};

exports.protectCitizen = (req, res, next) => {
  if (req.role !== "citizen") return res.status(403).json({ message: "Citizen only" });
  next();
};
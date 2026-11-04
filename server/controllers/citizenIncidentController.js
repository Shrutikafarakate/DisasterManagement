

const CitizenIncident = require("../models/CitizenIncident");

exports.createIncident = async (req, res) => {
  try {
    const { title, type, severity, description, location } = req.body; // Updated to 'location' object

    if (!title || !type || !description || !location) {
      return res.status(400).json({ message: "Title, type, description, and location are required" });
    }

    const incident = await CitizenIncident.create({
      title,
      type,
      severity: severity || "LOW",
      description,
      location, // { lat, lng, address }
      citizen: req.user._id, // Updated ref to 'citizen'
    });

    console.log("✅ Citizen Incident Created:", incident._id);
    res.status(201).json({ message: "Incident reported successfully", incident });
  } catch (err) {
    console.error("❌ Citizen Incident Error:", err);
    res.status(500).json({ message: "Server error while creating incident" });
  }
};

exports.getMyIncidents = async (req, res) => {
  try {
    const incidents = await CitizenIncident.find({ citizen: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(incidents);
  } catch (err) {
    console.error("❌ Fetch Citizen Incidents Error:", err);
    res.status(500).json({ message: "Server error fetching incidents" });
  }
};
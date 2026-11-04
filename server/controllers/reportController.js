// const Report = require("../models/Report");

// // Create New Report
// exports.createReport = async (req, res) => {
//   try {
//     const report = await Report.create({
//       ...req.body,
//       reportedBy: req.user._id // Taken from the logged-in token
//     });
//     res.status(201).json(report);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to submit report" });
//   }
// };

// // Get History for Logged In User
// exports.getMyReports = async (req, res) => {
//   try {
//     const reports = await Report.find({ reportedBy: req.user._id })
//                                 .sort({ createdAt: -1 });
//     res.json(reports);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch history" });
//   }
// };

const Report = require("../models/Report");

exports.createReport = async (req, res) => {
  try {
    const { type, description, location, missionId } = req.body;

    if (!type || !description || !location) {
      return res.status(400).json({ message: "Type, description, and location are required" });
    }

    const report = await Report.create({
      mission: missionId || null, // Updated to 'mission' ref
      type,
      description,
      location,
      reportedBy: req.user._id,
      status: "PENDING",
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (err) {
    console.error("❌ Create Report Error:", err);
    res.status(500).json({ message: "Failed to submit report" });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(reports);
  } catch (err) {
    console.error("❌ Get My Reports Error:", err);
    res.status(500).json({ message: "Failed to fetch report history" });
  }
};
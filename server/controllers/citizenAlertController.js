// const CitizenAlert = require("../models/CitizenAlert");

// exports.getCitizenAlerts = async (req, res) => {
//   try {
//     const alerts = await CitizenAlert.find({}).sort({ createdAt: -1 });

//     res.json(alerts);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const CitizenAlert = require("../models/CitizenAlert");

/**
 * GET /api/citizen/alerts
 * Fetch ALL active alerts for citizens (HARD RESET - No Filtering)
 */
exports.getCitizenAlerts = async (req, res) => {
  try {
    // Determine user role from auth middleware
    const userRole = req.role ? req.role.toUpperCase() : "CITIZEN";

    // Filter logic:
    // 1. Audience is "ALL" (Global broadcast)
    // 2. Audience matches the user's role (e.g., "CITIZEN" or "VOLUNTEER")
    const query = {
      audience: { $in: ["ALL", userRole] }
    };

    const alerts = await CitizenAlert.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("CitizenAlert Error:", err);
    res.status(500).json({ message: "Failed to load alerts" });
  }
};

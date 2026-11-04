// const VolunteerAlert = require("../models/VolunteerAlert");

// exports.getVolunteerAlerts = async (req, res) => {
//   try {
//     const alerts = await VolunteerAlert.find({
//       volunteer: req.user._id,
//     })
//       .populate("mission")
//       .sort({ createdAt: -1 });

//     res.json(alerts);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const VolunteerAlert = require("../models/VolunteerAlert");

/**
 * --------------------------------
 * GET ALERTS FOR LOGGED-IN VOLUNTEER
 * --------------------------------
 * Used in Volunteer Dashboard / Notifications panel
 */
exports.getVolunteerAlerts = async (req, res) => {
  try {
    const alerts = await VolunteerAlert.find({
      volunteer: req.user._id,
    })
      .populate("mission", "title status location createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    console.error("❌ Get Volunteer Alerts Error:", err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

// const Mission = require("../models/Mission");

// exports.getMissions = async (req, res) => {
//   try {
//     const missions = await Mission.find()
//       .populate("assignedTeam")
//       .populate("volunteer")
//       .sort({ createdAt: -1 });

//     res.json(missions);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.getMissionById = async (req, res) => {
//   try {
//     const mission = await Mission.findById(req.params.id)
//       .populate("assignedTeam")
//       .populate("volunteer");

//     res.json(mission);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.acceptMission = async (req, res) => {
//   try {
//     const mission = await Mission.findByIdAndUpdate(
//       req.params.id,
//       { status: "ACCEPTED", volunteer: req.user._id },
//       { new: true }
//     );
//     res.json(mission);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.completeMission = async (req, res) => {
//   try {
//     const mission = await Mission.findByIdAndUpdate(
//       req.params.id,
//       { status: "COMPLETED" },
//       { new: true }
//     );
//     res.json(mission);
//   } catch {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const Mission = require("../models/Mission");
const Volunteer = require("../models/Volunteer");

/**
 * --------------------------------
 * GET ALL MISSIONS (Admin / Volunteer)
 * --------------------------------
 */
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate("assignedTeam")
      .populate("volunteer", "name phone status")
      .sort({ createdAt: -1 });

    res.json(missions);
  } catch (err) {
    console.error("❌ Get Missions Error:", err);
    res.status(500).json({ message: "Server error while fetching missions" });
  }
};

/**
 * --------------------------------
 * GET SINGLE MISSION
 * --------------------------------
 */
exports.getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate("assignedTeam")
      .populate("volunteer", "name phone status");

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.json(mission);
  } catch (err) {
    console.error("❌ Get Mission Error:", err);
    res.status(500).json({ message: "Server error while fetching mission" });
  }
};

/**
 * --------------------------------
 * VOLUNTEER ACCEPTS MISSION
 * --------------------------------
 */
exports.acceptMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    if (mission.status !== "PENDING") {
      return res.status(400).json({
        message: "Mission cannot be accepted in current state",
      });
    }

    mission.status = "ACCEPTED";
    mission.volunteer = req.user._id;

    await mission.save();

    // 🔹 Update volunteer status
    await Volunteer.findByIdAndUpdate(req.user._id, {
      status: "DEPLOYED",
    });

    res.json({
      message: "Mission accepted",
      mission,
    });
  } catch (err) {
    console.error("❌ Accept Mission Error:", err);
    res.status(500).json({ message: "Server error while accepting mission" });
  }
};

/**
 * --------------------------------
 * VOLUNTEER COMPLETES MISSION
 * --------------------------------
 */
exports.completeMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    if (mission.volunteer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not assigned to this mission",
      });
    }

    if (mission.status !== "IN_PROGRESS" && mission.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Mission cannot be completed in current state",
      });
    }

    mission.status = "COMPLETED";
    await mission.save();

    // 🔹 Free volunteer
    await Volunteer.findByIdAndUpdate(req.user._id, {
      status: "AVAILABLE",
    });

    res.json({
      message: "Mission completed successfully",
      mission,
    });
  } catch (err) {
    console.error("❌ Complete Mission Error:", err);
    res.status(500).json({ message: "Server error while completing mission" });
  }
};

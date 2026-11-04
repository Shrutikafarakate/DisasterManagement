const express = require("express");
const {
  getMissions,
  getMissionById,
  acceptMission,
  completeMission,
} = require("../controllers/missionController");

const router = express.Router();

router.get("/", getMissions);
router.get("/:id", getMissionById);
router.post("/:id/accept", acceptMission);
router.post("/:id/complete", completeMission);

module.exports = router;

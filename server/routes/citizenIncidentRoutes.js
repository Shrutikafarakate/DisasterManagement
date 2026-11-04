const express = require("express");
const router = express.Router();
const { createIncident, getMyIncidents } = require("../controllers/citizenIncidentController");

router.post("/", createIncident); // Matches /api/citizen/incidents
router.get("/my", getMyIncidents); // Matches /api/citizen/incidents/my

module.exports = router;
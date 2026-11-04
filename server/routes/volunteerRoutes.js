// const express = require("express");
// const {
//   getVolunteerMe,
//   updateVolunteer,getDashboardData,    
//   getAvailableMissions,
//   acceptMission,       
//   completeMission,
//   submitTraining
// } = require("../controllers/volunteerController");

// const router = express.Router();


// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const vol = await Volunteer.findOne({ email });
//   if (!vol) return res.status(400).json({ message: "Volunteer not found" });

//   const match = await bcrypt.compare(password, vol.password);
//   if (!match) return res.status(400).json({ message: "Invalid password" });

//   const token = generateToken(vol._id, "volunteer");

//   res.json({ token });
// });


// router.get("/me", getVolunteerMe);
// router.put("/me", updateVolunteer);
// router.get("/me", getVolunteerMe);
// router.put("/me", updateVolunteer);

// router.get("/dashboard", getDashboardData); // Dashboard Feed
// router.post("/training/submit", submitTraining);
// router.get("/missions", getAvailableMissions); // Mission List
// router.put("/missions/:id/accept", acceptMission);
// router.put("/missions/:id/complete", completeMission);

// module.exports = router;


const express = require("express");
const {
  getVolunteerMe,
  updateVolunteer,
  getDashboardData,
  getAvailableMissions,
  acceptIncident,
  getIncident,
  resolveIncident,
  completeMission,
  submitTraining
} = require("../controllers/volunteerController");

const router = express.Router();

router.get("/me", getVolunteerMe);
router.put("/me", updateVolunteer);

router.get("/dashboard", getDashboardData); // Dashboard Feed
router.post("/training/submit", submitTraining);
router.get("/missions", getAvailableMissions); // Mission List
router.get("/incidents/:id", getIncident); // <--- NEW ROUTE for Details
router.put("/incidents/:id/accept", acceptIncident);
router.put("/incidents/:id/resolve", resolveIncident);
router.put("/missions/:id/complete", completeMission);

module.exports = router;
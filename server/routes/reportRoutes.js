const express = require("express");
const { createReport, getMyReports } = require("../controllers/reportController");

const router = express.Router();

router.post("/", createReport);
router.get("/me", getMyReports);

module.exports = router;

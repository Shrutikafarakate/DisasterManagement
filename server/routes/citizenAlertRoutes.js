const express = require("express");
const { getCitizenAlerts } = require("../controllers/citizenAlertController");

const router = express.Router();

router.get("/", getCitizenAlerts);

module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, sendOtp } = require("../controllers/volunteerController");

router.post("/send-otp", sendOtp); // Request OTP
router.post("/register", register); // Verify OTP & Create Account
router.post("/login", login);

module.exports = router;
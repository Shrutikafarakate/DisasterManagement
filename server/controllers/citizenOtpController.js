const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail"); // Use the utility we made!

exports.sendOtp = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 1. Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await sendEmail({
      email,
      subject: "Disaster Portal - Citizen Verification",
      message: `Your OTP is ${code}`,
      otp: code
    });

    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: code });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    if (err.code === "EMAIL_CONFIG_MISSING") {
      console.warn("Citizen OTP email unavailable:", err.message);
      return res.status(503).json({ message: err.message });
    }
    console.error("sendOtp error:", err.message);
    res.status(502).json({ message: "Could not send OTP email. Check SMTP settings and try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    // Frontend might send 'otp' or 'code', let's handle both
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const code = req.body.otp || req.body.code;

    if (!email || !code)
      return res.status(400).json({ message: "Email and OTP are required" });

    // Find the OTP record
    const record = await Otp.findOne({ email });
    
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Compare directly (Schema stores raw OTP)
    if (record.otp !== code.toString()) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // OTP Valid -> Delete it so it can't be used again
    await Otp.deleteOne({ email });

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
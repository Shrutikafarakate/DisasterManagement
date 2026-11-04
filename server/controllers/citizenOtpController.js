const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");
const { generateOtp, isValidOtp } = require("../utils/otp");

const isValidEmail = (email) =>
  /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email);

exports.sendOtp = async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "A valid email is required" });
    }

    const code = generateOtp();
    await Otp.deleteMany({ email });
    const record = await Otp.create({ email, otp: code });

    try {
      await sendEmail({
        email,
        subject: "Disaster Portal - Citizen Verification",
        message: `Your OTP is ${code}`,
        otp: code,
      });
    } catch (error) {
      await Otp.deleteOne({ _id: record._id });
      throw error;
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    if (err.code === "EMAIL_CONFIG_MISSING" || err.code === "EMAIL_CONFIG_INVALID") {
      console.error("Citizen OTP email configuration error:", err.message);
      return res.status(503).json({ message: err.message });
    }
    console.error("sendOtp error:", err.message);
    res.status(502).json({ message: "Could not send OTP email. Check email provider settings and try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    // Frontend might send 'otp' or 'code', let's handle both
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
    const submittedCode = req.body.otp ?? req.body.code;
    const code = typeof submittedCode === "string"
      ? submittedCode.trim()
      : typeof submittedCode === "number"
        ? String(submittedCode)
        : "";

    if (!isValidEmail(email) || !code)
      return res.status(400).json({ message: "Email and OTP are required" });

    // Find the OTP record
    const record = await Otp.findOne({ email });
    
    if (!isValidOtp(record, code)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP Valid -> Delete it so it can't be used again
    await Otp.deleteOne({ email });

    res.json({ message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error", err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};
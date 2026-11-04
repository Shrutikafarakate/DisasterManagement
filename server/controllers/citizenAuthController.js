

const Citizen = require("../models/Citizen");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidOtp } = require("../utils/otp");

/**
 * -------------------------
 * CITIZEN REGISTER
 * -------------------------
 */
exports.register = async (req, res) => {
  try {
    const { name, password, phone, otp } = req.body;
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    // Basic validation
    if (!name || !email || !password || !phone || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!isValidOtp(otpRecord, String(otp).trim())) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if citizen already exists (email OR phone)
    const existing = await Citizen.findOne({
      $or: [{ email }, { phone }]
    });

    if (existing) {
      return res.status(400).json({ message: "Citizen already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create citizen (auto-approved)
    const citizen = await Citizen.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isApproved: true
    });

    await Otp.deleteOne({ email });

    res.status(201).json({
      message: "Registration successful",
      citizen: {
        id: citizen._id,
        name: citizen.name,
        email: citizen.email
      }
    });

  } catch (err) {
    console.error("Citizen Register Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * -------------------------
 * CITIZEN LOGIN
 * -------------------------
 */
exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    // Validate
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const citizen = await Citizen.findOne({ email });
    if (!citizen) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check approval / suspension
    if (citizen.isApproved === false) {
      return res.status(403).json({
        message: "Account suspended by admin"
      });
    }

    const isMatch = await bcrypt.compare(password, citizen.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: citizen._id,
        role: "citizen"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: citizen._id,
        name: citizen.name,
        role: "citizen"
      }
    });

  } catch (err) {
    console.error("Citizen Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

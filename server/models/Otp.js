const mongoose = require("mongoose");
const OTP_TTL_SECONDS = 5 * 60;

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  
  // Stores the 6-digit code
  otp: { type: String, required: true }, 
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: OTP_TTL_SECONDS },
  },
});

module.exports = mongoose.model("Otp", otpSchema);
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  
  // Stores the 6-digit code
  otp: { type: String, required: true }, 
  
  // Automatically deletes this document after 300 seconds (5 minutes)
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } 
});

module.exports = mongoose.model("Otp", otpSchema);
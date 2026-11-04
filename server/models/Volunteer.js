const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    skills: [{ type: String }],
    location: String,

    status: {
      type: String,
      enum: ["AVAILABLE", "BUSY", "OFF_DUTY", "DEPLOYED"],
      default: "AVAILABLE",
    },

    approved: { type: Boolean, default: false },

    trainingStatus: {
      type: String,
      enum: ["PENDING", "CERTIFIED"],
      default: "PENDING",
    },

    quizScore: { type: Number, default: 0 },

    roleType: {
      type: String,
      enum: ["VOLUNTEER"],
      default: "VOLUNTEER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);

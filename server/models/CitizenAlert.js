// const mongoose = require("mongoose");

// const citizenAlertSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   type: { type: String, default: "WEATHER" }, // WEATHER, REGION_WARNING, etc.
//   region: { type: String }, // Coordinates or City Name
//   severity: { type: String, default: "LOW" }, // LOW, MEDIUM, HIGH, CRITICAL
//   status: { type: String, default: "ACTIVE" }, // ACTIVE, EXPIRED
// }, { timestamps: true });


// module.exports = mongoose.model("CitizenAlert", citizenAlertSchema);

const mongoose = require("mongoose");

const citizenAlertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    region: String,

    // New field to store specific incident type (Flood, Fire, etc.)
    // when 'type' is set to "BROADCAST"
    category: {
      type: String,
      default: "GENERAL"
    },

    // To explicitly track target audience "ALL" vs "CITIZEN"
    audience: {
      type: String,
      default: "ALL"
    },

    sourceType: {
      type: String,
      default: "ADMIN",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CitizenAlert", citizenAlertSchema);

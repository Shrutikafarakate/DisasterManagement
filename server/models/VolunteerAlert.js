// const mongoose = require("mongoose");

// const volunteerAlertSchema = new mongoose.Schema(
//   {
//     volunteer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Volunteer",
//     },

//     type: String,    // assignment, warning, mission-update
//     message: String,

//     mission: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Mission",
//     },

//     seen: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("VolunteerAlert", volunteerAlertSchema);


const mongoose = require("mongoose");

const volunteerAlertSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    title: String,
    message: String,

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    sourceType: {
      type: String,
      default: "ADMIN",
    },

    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },

    status: {
      type: String,
      enum: ["UNREAD", "READ"],
      default: "UNREAD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VolunteerAlert", volunteerAlertSchema);

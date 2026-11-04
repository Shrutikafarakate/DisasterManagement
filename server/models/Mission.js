// const mongoose = require("mongoose");

// const MissionSchema = new mongoose.Schema(
//   {
//     title: String,
//     type: String,
//     description: String,
//     urgency: String,

//     location: {
//       lat: Number,
//       lng: Number,
//       address: String,
//     },

//     volunteer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Volunteer",
//     },

//     assignedTeam: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//     },

//     status: {
//       type: String,
//       enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"],
//       default: "PENDING",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Mission", MissionSchema);


const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", MissionSchema);

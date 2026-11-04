// const mongoose = require("mongoose");

// const reportSchema = new mongoose.Schema({
//   missionId: { type: String },
//   type: { type: String, required: true },
//   description: { type: String, required: true },
//   location: { type: String, required: true },
//   reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
//   status: { type: String, default: "PENDING" },
  
//   // ✅ ADD THESE ARRAYS
//   adminReplies: [{
//     message: String,
//     date: { type: Date, default: Date.now }
//   }],
//   adminNotes: [{
//     note: String,
//     date: { type: Date, default: Date.now }
//   }],
//   // -------------------

//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Report", reportSchema);

const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Field Report" },
    description: { type: String, required: true },

    sourceType: {
      type: String,
      default: "VOLUNTEER",
    },

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

    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "COMPLETED"],
      default: "PENDING",
    },

    adminReplies: [
      {
        message: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    adminNotes: [
      {
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);

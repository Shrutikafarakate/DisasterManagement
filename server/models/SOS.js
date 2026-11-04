// const mongoose = require("mongoose");

// const sosSchema = new mongoose.Schema({
//   latitude: Number,
//   longitude: Number,
//   timestamp: { type: Date, default: Date.now },

//   // Optional: Connect SOS to user if logged in
//   reportedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Citizen",
//     default: null,
//   },

//   status: { type: String, default: "PENDING" },

//   adminReplies: [
//     {
//       message: String,
//       date: { type: Date, default: Date.now },
//     },
//   ],

//   adminNotes: [
//     {
//       note: String,
//       date: { type: Date, default: Date.now },
//     },
//   ],
// });

// module.exports = mongoose.model("SOS", sosSchema);

const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    title: { type: String, default: "SOS Report" },

    sourceType: {
      type: String,
      default: "SOS",
    },

    severity: {
      type: String,
      enum: ["HIGH", "CRITICAL"],
      default: "HIGH",
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACKNOWLEDGED", "CONVERTED"],
      default: "PENDING",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SOS", sosSchema);

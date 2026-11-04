// const mongoose = require('mongoose');

// const teamSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],
//   leader: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' },
//   status: {
//     type: String,
//     enum: ['AVAILABLE', 'DEPLOYED', 'OFFLINE'],
//     default: 'AVAILABLE'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Team', teamSchema);

const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" },
    ],

    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "DEPLOYED", "OFFLINE"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);

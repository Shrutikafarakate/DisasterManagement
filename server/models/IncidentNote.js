// const mongoose = require("mongoose");

// const IncidentNoteSchema = new mongoose.Schema(
//   {
//     incidentId: String,
//     content: String,
//     author: String
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("IncidentNote", IncidentNoteSchema);

const mongoose = require("mongoose");

const IncidentNoteSchema = new mongoose.Schema(
  {
    // 🔗 Which incident this note belongs to
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "incidentModel", // CitizenIncident | Report | SOS
    },

    incidentModel: {
      type: String,
      required: true,
      enum: ["CitizenIncident", "Report", "SOS"],
    },

    // 📝 Actual note content
    note: {
      type: String,
      required: true,
      trim: true,
    },

    // 👤 WHO wrote the note
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "authorModel",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["ADMIN", "VOLUNTEER", "CITIZEN", "SYSTEM"],
        required: true,
      },
    },

    authorModel: {
      type: String,
      enum: ["Admin", "Volunteer", "Citizen"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("IncidentNote", IncidentNoteSchema);


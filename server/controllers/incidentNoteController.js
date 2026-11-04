// const IncidentNote = require("../models/IncidentNote");

// exports.addNote = async (req, res) => {
//   const note = await IncidentNote.create({
//     incidentId: req.body.incidentId,
//     content: req.body.content,
//     author: req.user.name,
//   });

//   res.json(note);
// };

// exports.getNotes = async (req, res) => {
//   const notes = await IncidentNote.find({
//     incidentId: req.params.incidentId,
//   }).sort({ createdAt: -1 });

//   res.json(notes);
// };


const IncidentNote = require("../models/IncidentNote");

exports.addNote = async (req, res) => {
  try {
    const { incident, note, incidentModel } = req.body;
    if (!incident || !note || !incidentModel) {
      return res.status(400).json({ message: "Incident ID, note, and model are required" });
    }

    const newNote = await IncidentNote.create({
      incident,
      incidentModel,
      note,
      author: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.roleType || "VOLUNTEER", // Adjust based on user
      },
    });

    res.json(newNote);
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ message: "Failed to add note" });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await IncidentNote.find({ incident: req.params.incidentId })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({ message: "Failed to load notes" });
  }
};
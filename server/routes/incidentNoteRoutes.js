const express = require("express");
const {
  addNote,
  getNotes
} = require("../controllers/incidentNoteController");

const router = express.Router();

router.post("/", addNote);
router.get("/:incidentId", getNotes);

module.exports = router;

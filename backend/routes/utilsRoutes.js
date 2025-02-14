const express = require("express");
const { createNote, deleteNote, getNotes } = require("../controllers/noteController");
const { createAssignment, deleteAssignment, getAssignments } = require("../controllers/assignmentController");
const router = express.Router();

// Note routes
router.post("/notes", createNote);
router.delete("/notes/:id", deleteNote );
router.get("/notes", getNotes);

// Assignment routes
router.post("/assignments", createAssignment );
router.delete("/assignments/:id", deleteAssignment);
router.get("/assignments",getAssignments)

module.exports = router;

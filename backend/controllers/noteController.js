const Note = require("../models/Notes");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, date } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const newNote = new Note({ title, content, date });
    const savedNote = await newNote.save();

    return res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an existing note by ID
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//getnote
exports.getNotes = async (req, res) => {
    try {
      const notes = await Note.find();
      return res.status(200).json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

// Get a single note by ID
exports.getNoteById = async (req, res) => {
    try {
      const { id } = req.params;
      const note = await Note.findById(id);
  
      if (!note) {
        return res.status(404).json({ message: "Note not found." });
      }
  
      return res.status(200).json(note);
    } catch (error) {
      console.error("Error fetching note:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

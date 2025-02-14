const Assignment = require("../models/Assignment");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, className } = req.body;

    // Basic validation: title and dueDate are required
    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date are required." });
    }

    const newAssignment = new Assignment({ title, description, dueDate, className });
    const savedAssignment = await newAssignment.save();

    return res.status(201).json(savedAssignment);
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an existing assignment by ID
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    return res.status(200).json({ message: "Assignment deleted successfully." });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all assignments
exports.getAssignments = async (req, res) => {
    try {
      const assignments = await Assignment.find();
      return res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  // Get a single assignment by ID
exports.getAssignmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await Assignment.findById(id);
  
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found." });
      }
  
      return res.status(200).json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

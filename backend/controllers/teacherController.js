const Teacher = require("../models/Teacher");
const User = require("../models/User")
const Class = require("../models/Class")

exports.getAllTeachers = async (req, res) => {
  try {
    // Extract query parameters for pagination and sorting
    const { page = 1, limit = 10, sortBy = "name", order = "asc" } = req.query;

    // Find teachers with sorting, pagination logic
    const teachers = await Teacher.find()
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    // Create a new teacher using the data from req.body
    const newTeacher = new Teacher(req.body);
    const savedTeacher = await newTeacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    // Find teacher by id and populate the assigned class details if available
    const teacher = await Teacher.findById(req.params.id).populate("assignedClass");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    // Update teacher details and return the updated teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    
    // Delete the teacher document
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    // Remove the teacher reference from Class documents
    await Class.updateMany(
      { teacher: teacherId },
      { $set: { teacher: null } } // or remove the field if needed
    );
    
    // Optionally, delete the associated User document
    await User.findOneAndDelete({ profileId: teacherId, role: "Teacher" });
    
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


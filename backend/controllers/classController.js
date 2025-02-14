const Class = require('../models/Class');
const Teacher = require('../models/Teacher')
const Studnet = require('../models/Student')
const mongoose = require("mongoose");
const Student = require('../models/Student');

// Get all classes with pagination, filtering, sorting logic
exports.getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
    const classes = await Class.find()
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get class details (with populated teacher and students)
exports.getClassById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const classData = await Class.findById(req.params.id)


    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }

    res.json(classData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { teacher } = req.body; // the new teacher id, if provided
    const { students } = req.body;

    // Retrieve the current class document to check the current teacher (if any)
    const currentClass = await Class.findById(classId);
    if (!currentClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update the class document
    const updatedClass = await Class.findByIdAndUpdate(classId, req.body, { new: true });

    // If the request includes a teacher field, update the teacher's assignedClass field.
    if (teacher) {
      // Update the new teacher's assignedClass to this class.
      await Teacher.findByIdAndUpdate(teacher, { assignedClass: updatedClass._id });
      
      // If there was a previously assigned teacher and it's different from the new teacher,
      // optionally clear the assignedClass field for the old teacher.
      if (currentClass.teacher && currentClass.teacher.toString() !== teacher) {
        await Teacher.findByIdAndUpdate(currentClass.teacher, { assignedClass: null });
      }
    }

    if (students) {
      // Update the new teacher's assignedClass to this class.
      await Student.findByIdAndUpdate(students, { class: updatedClass._id });
      
      // If there was a previously assigned teacher and it's different from the new teacher,
      // optionally clear the assignedClass field for the old teacher.
      if (currentClass.students && currentClass.students.toString() !== students) {
        await Student.findByIdAndUpdate(currentClass.students, { assignedClass: null });
      }
    }

    res.json(updatedClass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    await Class.findByIdAndDelete(classId);
    await Teacher.updateMany({ assignedClass: classId }, { $set: { assignedClass: null } });
    await Student.updateMany({ class: classId }, { $set: { class: null } });
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


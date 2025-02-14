const Student = require("../models/Student");
const User = require("../models/User");
const Class = require("../models/Class")

exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "name", order = "asc" } = req.query;
    const students = await Student.find()
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("class");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const currentStudent = await Student.findById(studentId);
    if (!currentStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    const oldClassId = currentStudent.class ? currentStudent.class.toString() : null;
    const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
    
    if (req.body.class) {
      const newClassId = req.body.class;
      if (oldClassId && oldClassId !== newClassId) {
        await Class.findByIdAndUpdate(oldClassId, { $pull: { students: studentId } });
      }
      await Class.findByIdAndUpdate(newClassId, { $addToSet: { students: studentId } });
    }
    
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Delete the student document
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Remove the student reference from Class documents
    await Class.updateMany(
      { students: studentId },
      { $pull: { students: studentId } }
    );
    
    // Optionally, delete the associated User document
    await User.findOneAndDelete({ profileId: studentId, role: "Student" });
    
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



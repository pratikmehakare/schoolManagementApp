const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");

// GET all teachers
router.get("/", teacherController.getAllTeachers);
// GET a single teacher by ID
router.get("/:id", teacherController.getTeacherById);
// POST create a new teacher
router.post("/", teacherController.createTeacher);
// PUT update a teacher by ID
router.put("/:id", teacherController.updateTeacher);
// DELETE a teacher by ID
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;

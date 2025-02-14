const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

exports.getClassAnalytics = async (req, res) => {
  try {
    // Find the class by id and populate teacher and students details
    const classData = await Class.findById(req.params.id)
      .populate("teacher")
      .populate("students");
    if (!classData) return res.status(404).json({ error: "Class not found" });

    // Compute gender distribution from the students array
    const genderCounts = classData.students.reduce((acc, student) => {
      acc[student.gender] = (acc[student.gender] || 0) + 1;
      return acc;
    }, {});

    res.json({
      classDetails: classData, // Contains name, year, teacher, students, etc.
      genderAnalytics: genderCounts, // For graphing male/female counts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFinancialAnalytics = async (req, res) => {
  try {
    // Expecting query parameters:
    // view = "monthly" or "yearly"
    // month (if monthly view) and year are provided by the client
    const { view, month, year } = req.query;
    let teacherFilter = {};
    let studentFilter = {};

    // Apply date filtering if required (assuming your models use timestamps)
    if (view === "monthly" && month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      teacherFilter.updatedAt = { $gte: startDate, $lt: endDate };
      studentFilter.updatedAt = { $gte: startDate, $lt: endDate };
    } else if (view === "yearly" && year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(Number(year) + 1, 0, 1);
      teacherFilter.updatedAt = { $gte: startDate, $lt: endDate };
      studentFilter.updatedAt = { $gte: startDate, $lt: endDate };
    }

    // Aggregate total teacher salaries
    const salaryAgg = await Teacher.aggregate([
      { $match: teacherFilter },
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);

    // Aggregate total student fees collected
    const feesAgg = await Student.aggregate([
      { $match: studentFilter },
      { $group: { _id: null, totalFees: { $sum: "$feesPaid" } } },
    ]);

    const totalSalaryExpense = salaryAgg[0] ? salaryAgg[0].totalSalary : 0;
    const totalFeesIncome = feesAgg[0] ? feesAgg[0].totalFees : 0;

    res.json({ totalSalaryExpense, totalFeesIncome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

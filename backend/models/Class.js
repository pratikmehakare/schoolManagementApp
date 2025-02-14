const mongoose = require("mongoose");
require("./Student")
require("./Teacher")

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  studentFees: {
    type: Number,
    required: true,
  },
  capacity: {
    type: Number,
    default: 30,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = mongoose.model("Class", ClassSchema);

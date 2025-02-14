import React, { useEffect, useState } from "react";
import { getAllStudent } from "../../../services/oprations/studentAPI";
import { getAllClass } from "../../../services/oprations/classAPI";
import ListDisplay from "../../common/ListDisplay";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  
  // State for search filters
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchStudentClass, setSearchStudentClass] = useState("");

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudent();
        setStudents(res);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch available classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClass();
        setAvailableClasses(res);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Filter students by search filters: name and assigned class
  const filteredStudents = students.filter((student) => {
    const matchesName = student.name
      .toLowerCase()
      .includes(searchStudentName.toLowerCase());
    const matchesClass =
      searchStudentClass === "" || student.class === searchStudentClass;
    return matchesName && matchesClass;
  });

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Student Management</h1>
      <p className="mb-6 text-gray-300">
        View student profiles and related information.
      </p>

      {/* Search Filters */}
      <div className="mb-4">
        <label htmlFor="searchStudentName" className="block text-gray-300 mb-2">
          Search by Student Name
        </label>
        <input
          type="text"
          id="searchStudentName"
          value={searchStudentName}
          onChange={(e) => setSearchStudentName(e.target.value)}
          placeholder="Enter student name..."
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="searchStudentClass" className="block text-gray-300 mb-2">
          Filter by Class
        </label>
        <select
          id="searchStudentClass"
          value={searchStudentClass}
          onChange={(e) => setSearchStudentClass(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        >
          <option value="">All Classes</option>
          {availableClasses.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      <ListDisplay
        title="Students List"
        items={filteredStudents}
        renderItem={(student) => (
          <div className="p-4 border-b border-gray-700">
            <p>
              <strong>Name:</strong> {student?.name}
            </p>
            <p>
              <strong>Gender:</strong> {student?.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {student?.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {student?.email}
            </p>
            <p>
              <strong>Fees Paid:</strong> ₹{student?.feesPaid}
            </p>
            <p>
              <strong>Class:</strong>{" "}
              {student?.class
                ? availableClasses.find((cls) => cls._id === student.class)?.name ||
                  "Loading..."
                : "Not Assigned"}
            </p>
          </div>
        )}
        noDataText="No students found."
      />
    </div>
  );
};

export default Student;

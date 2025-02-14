import React, { useEffect, useState } from "react";
import { getAllAssignment } from "../../../services/oprations/assignmentAPI";
import { getAllClass } from "../../../services/oprations/classAPI";
import ListDisplay from "../../common/ListDisplay";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  // Fetch assignments on mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await getAllAssignment();
        setAssignments(res);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
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

  // Filter assignments based on the selected class
  const filteredAssignments = selectedClass
    ? assignments.filter(
        (assignment) => assignment.className === selectedClass
      )
    : assignments;

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Assignments</h1>
      <p className="mb-6 text-gray-300">Here are your assignments.</p>

      {/* Search by Class Dropdown */}
      <div className="mb-6">
        <label htmlFor="classFilter" className="block text-gray-300 mb-2">
          Filter by Class
        </label>
        <select
          id="classFilter"
          name="classFilter"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
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
        title="Assignments List"
        items={filteredAssignments}
        renderItem={(assignment) => (
          <div className="p-4 border-b border-gray-700">
            <p>
              <strong>Title:</strong> {assignment?.title}
            </p>
            <p>
              <strong>Description:</strong> {assignment?.description}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {assignment?.dueDate
                ? new Date(assignment.dueDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Class:</strong>{" "}
              {assignment?.className
                ? availableClasses.find(
                    (cls) => cls._id === assignment.className
                  )?.name || "Loading..."
                : "Not Assigned"}
            </p>
          </div>
        )}
        noDataText="No assignments found."
      />
    </div>
  );
};

export default Assignment;

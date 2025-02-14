import React, { useEffect, useState } from "react";
import {
  getAllAssignment,
  createAssignment,
  deleteAssignment,
} from "../../../services/oprations/assignmentAPI";
import { getAllClass } from "../../../services/oprations/classAPI";
import ListDisplay from "../../common/ListDisplay";

const Assignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(""); // state for search filter

  // Modal state for adding a new assignment
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);

  // State for new assignment data (Add Assignment Modal)
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: "",
    description: "",
    dueDate: "",
    className: "", // assigned class ID (optional) as per the model
  });

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

  // ===== Add Assignment Modal Handlers =====
  const openAddAssignmentModal = () => {
    setShowAddAssignmentModal(true);
  };

  const closeAddAssignmentModal = () => {
    setShowAddAssignmentModal(false);
    setNewAssignmentData({
      title: "",
      description: "",
      dueDate: "",
      className: "",
    });
  };

  const handleNewAssignmentChange = (e) => {
    const { name, value } = e.target;
    setNewAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignmentSubmit = async (e) => {
    e.preventDefault();
    const assignmentData = {
      title: newAssignmentData.title,
      description: newAssignmentData.description,
      dueDate: newAssignmentData.dueDate,
      className: newAssignmentData.className || null,
    };
    try {
      const createdAssignment = await createAssignment(assignmentData);
      setAssignments((prev) => [...prev, createdAssignment]);
      closeAddAssignmentModal();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  // ===== Delete Assignment Handler =====
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await deleteAssignment(assignmentId);
      setAssignments((prev) =>
        prev.filter(
          (assignment) => (assignment._id || assignment.id) !== assignmentId
        )
      );
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Assignment Management</h1>
      <p className="mb-6 text-gray-300">
        Manage assignments and related information.
      </p>

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
            <div className="mt-4 flex space-x-3">
              <button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                onClick={() =>
                  handleDeleteAssignment(assignment._id || assignment.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        )}
        noDataText="No assignments found."
      />

      {/* Floating "Add Assignment" Button */}
      <button
        className="fixed bottom-9 right-9 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full shadow-lg transition-colors"
        onClick={openAddAssignmentModal}
      >
        Add Assignment
      </button>

      {/* ===== Add Assignment Modal ===== */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Assignment</h2>
            <form onSubmit={handleAddAssignmentSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={newAssignmentData.title}
                  onChange={handleNewAssignmentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-300">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={newAssignmentData.description}
                  onChange={handleNewAssignmentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={newAssignmentData.dueDate}
                  onChange={handleNewAssignmentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="className" className="block text-gray-300">
                  Class (Optional)
                </label>
                <select
                  name="className"
                  id="className"
                  value={newAssignmentData.className}
                  onChange={handleNewAssignmentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                >
                  <option value="">Not Assigned</option>
                  {availableClasses.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAddAssignmentModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignment;

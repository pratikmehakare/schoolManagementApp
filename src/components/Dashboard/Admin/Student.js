import React, { useEffect, useState } from "react";
import { 
  getAllStudent, 
  // createStudent, 
  updateStudent, 
  deleteStudent 
} from "../../../services/oprations/studentAPI";
import { getAllClass } from "../../../services/oprations/classAPI";
import ListDisplay from "../../common/ListDisplay";

const Student = () => {
  const [students, setStudents] = useState([]);
  
  // Modal state for adding a new student
  //const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  // Modal state for editing a student
  const [showEditStudentModal, setShowEditStudentModal] = useState({
    open: false,
    studentIndex: null,
    studentData: {},
  });
  
  // // State for new student data (Add Student Modal)
  // const [newStudentData, setNewStudentData] = useState({
  //   name: "",
  //   gender: "Male",
  //   dob: "",
  //   email: "",
  //   feesPaid: "",
  //   class: "", // assigned class ID
  // });
  
  // State for available classes for the "Class" dropdown
  const [availableClasses, setAvailableClasses] = useState([]);
  
  // State for search filters
  const [searchStudentName, setSearchStudentName] = useState("");
  const [searchStudentClass, setSearchStudentClass] = useState("");

  // Fetch students on mount (and when edit modal closes/opens)
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
  }, [showEditStudentModal]);
  
  // Fetch available classes
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
  
  // ===== Add Student Modal Handlers =====
  // const openAddStudentModal = () => {
  //   setShowAddStudentModal(true);
  // };
  
  // const closeAddStudentModal = () => {
  //   setShowAddStudentModal(false);
  //   setNewStudentData({
  //     name: "",
  //     gender: "Male",
  //     dob: "",
  //     email: "",
  //     feesPaid: "",
  //     class: "",
  //   });
  // };
  
  // const handleNewStudentChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewStudentData((prev) => ({ ...prev, [name]: value }));
  // };
  
  // const handleAddStudentSubmit = async (e) => {
  //   e.preventDefault();
  //   const studentData = {
  //     name: newStudentData.name,
  //     gender: newStudentData.gender,
  //     dob: newStudentData.dob,
  //     email: newStudentData.email,
  //     feesPaid: newStudentData.feesPaid ? Number(newStudentData.feesPaid) : 0,
  //     class: newStudentData.class || null,
  //   };
  //   try {
  //     const createdStudent = await createStudent(studentData);
  //     setStudents((prev) => [...prev, createdStudent]);
  //     closeAddStudentModal();
  //   } catch (error) {
  //     console.error("Error creating student:", error);
  //   }
  // };
  
  // ===== Edit Student Modal Handlers =====
  // Update: Accept a student ID and locate its index in the students array
  
  const openEditStudentModal = (studentId) => {
    const index = students.findIndex(
      (student) => student._id === studentId || student.id === studentId
    );
    if (index !== -1) {
      setShowEditStudentModal({
        open: true,
        studentIndex: index,
        studentData: students[index],
      });
    }
  };
  
  const closeEditStudentModal = () => {
    setShowEditStudentModal({
      open: false,
      studentIndex: null,
      studentData: {},
    });
  };
  
  const handleEditStudentChange = (e) => {
    const { name, value } = e.target;
    setShowEditStudentModal((prev) => ({
      ...prev,
      studentData: { ...prev.studentData, [name]: value },
    }));
  };
  
  // In edit mode, update only provided fields.
  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    const { studentIndex, studentData } = showEditStudentModal;
    // Use the stored index to update the correct student.
    const studentId = students[studentIndex]._id || students[studentIndex].id;
    const updatedData = {
      ...(studentData.name && { name: studentData.name }),
      ...(studentData.gender && { gender: studentData.gender }),
      ...(studentData.dob && { dob: studentData.dob }),
      ...(studentData.email && { email: studentData.email }),
      ...(studentData.feesPaid && { feesPaid: Number(studentData.feesPaid) }),
      class: studentData.class !== undefined && studentData.class !== "" ? studentData.class : null,
    };
    try {
      const updatedStudent = await updateStudent(studentId, updatedData);
      setStudents((prev) =>
        prev.map((student, idx) =>
          idx === studentIndex ? updatedStudent : student
        )
      );
      closeEditStudentModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };
  
  // ===== Delete Student Handler =====
  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteStudent(studentId);
      setStudents((prev) =>
        prev.filter((student) => (student._id || student.id) !== studentId)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Filter students by search filters: name and assigned class.
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
        Manage student profiles and related information.
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
        renderItem={(student, index) => (
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
            <div className="mt-4 flex space-x-3">
              <button
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors"
                onClick={() => openEditStudentModal(student._id || student.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                onClick={() => handleDeleteStudent(student._id || student.id)}
              >
                Delete
              </button>
            </div>
          </div>
        )}
        noDataText="No students found."
      />
      
      {/* Floating "Add Student" Button
      <button
        className="fixed bottom-9 right-9 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full shadow-lg transition-colors"
        onClick={openAddStudentModal}
      >
        Add Student
      </button> */}
      
      {/* ===== Add Student Modal =====
      {showAddStudentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newStudentData.name}
                  onChange={handleNewStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={newStudentData.gender}
                  onChange={handleNewStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="dob"
                  value={newStudentData.dob}
                  onChange={handleNewStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={newStudentData.email}
                  onChange={handleNewStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="feesPaid" className="block text-gray-300">
                  Fees Paid
                </label>
                <input
                  type="number"
                  name="feesPaid"
                  id="feesPaid"
                  value={newStudentData.feesPaid}
                  onChange={handleNewStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="class" className="block text-gray-300">
                  Class (Optional)
                </label>
                <select
                  name="class"
                  id="class"
                  value={newStudentData.class}
                  onChange={handleNewStudentChange}
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
                  onClick={closeAddStudentModal}
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
      )} */}
      
      {/* ===== Edit Student Modal ===== */}
      {showEditStudentModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Student</h2>
            <form onSubmit={handleEditStudentSubmit}>
              <div className="mb-4">
                <label htmlFor="editName" className="block text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="editName"
                  value={showEditStudentModal.studentData?.name || ""}
                  onChange={handleEditStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editGender" className="block text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  id="editGender"
                  value={showEditStudentModal.studentData?.gender || "Male"}
                  onChange={handleEditStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="editDob" className="block text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  id="editDob"
                  value={
                    showEditStudentModal.studentData?.dob
                      ? new Date(showEditStudentModal.studentData.dob)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleEditStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editEmail" className="block text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="editEmail"
                  value={showEditStudentModal.studentData?.email || ""}
                  onChange={handleEditStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editFeesPaid" className="block text-gray-300">
                  Fees Paid
                </label>
                <input
                  type="number"
                  name="feesPaid"
                  id="editFeesPaid"
                  value={showEditStudentModal.studentData?.feesPaid || ""}
                  onChange={handleEditStudentChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editClass" className="block text-gray-300">
                  Class (Optional)
                </label>
                <select
                  name="class"
                  id="editClass"
                  value={showEditStudentModal.studentData?.class || ""}
                  onChange={handleEditStudentChange}
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
                  onClick={closeEditStudentModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors"
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

export default Student;

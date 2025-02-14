import React, { useEffect, useState } from "react";
import {
  getAllClass,
  createClass,
  deleteClass,
  updateClass, // Ensure this API function is defined as described previously
} from "../../../services/oprations/classAPI";
import { getAllStudent } from "../../../services/oprations/studentAPI";
import { getAllTeacher, getTeacherByID } from "../../../services/oprations/teacherAPI";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // Modal state for adding a new class
  const [classFormData, setClassFormData] = useState({
    name: "",
    year: "",
    studentFees: "",
    capacity: "",
  });

  // Teacher modal state: using teacherId (single selection)
  const [teacherModal, setTeacherModal] = useState({
    open: false,
    classIndex: null,
    teacherId: "",
  });

  // Student modal state: multiple selection using an array of selected student IDs
  const [studentModal, setStudentModal] = useState({
    open: false,
    classIndex: null,
    selectedStudents: [],
  });

  // State for available teachers and students fetched from backend
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  // Cache teacher names (only for teacher; students remain as IDs)
  const [teacherNames, setTeacherNames] = useState({});

  // Fetch classes when component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllClass();
        setClasses(res);

        // Fetch teacher names for each assigned teacher
        const teacherIds = res.map((cls) => cls.teacher).filter((id) => id);
        const teacherNamesMap = {};
        await Promise.all(
          teacherIds.map(async (id) => {
            const teacher = await getTeacherByID(id);
            teacherNamesMap[id] = teacher.name;
          })
        );
        setTeacherNames(teacherNamesMap);
      } catch (error) {
        console.error("Could not fetch Class Details", error);
      }
    })();
  }, [teacherModal]);

  // When the teacher modal opens, fetch the list of available teachers
  useEffect(() => {
    if (teacherModal.open) {
      (async () => {
        try {
          const res = await getAllTeacher();
          setAvailableTeachers(res.filter((t) => t));
        } catch (error) {
          console.error("Could not fetch teachers", error);
        }
      })();
    }
  }, [teacherModal.open]);

  // When the student modal opens, fetch the list of available students
  useEffect(() => {
    if (studentModal.open) {
      (async () => {
        try {
          const res = await getAllStudent();
          setAvailableStudents(res.filter((s) => s));
        } catch (error) {
          console.error("Could not fetch students", error);
        }
      })();
    }
  }, [studentModal.open]);

  // ===== Add Class Modal Handlers =====
  const openAddClassModal = () => {
    setShowAddClassModal(true);
  };

  const closeAddClassModal = () => {
    setShowAddClassModal(false);
    setClassFormData({
      name: "",
      year: "",
      studentFees: "",
      capacity: "",
    });
  };

  const handleClassChange = (e) => {
    const { name, value } = e.target;
    setClassFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    const newClassData = {
      name: classFormData.name,
      year: classFormData.year,
      studentFees: Number(classFormData.studentFees),
      capacity: classFormData.capacity ? Number(classFormData.capacity) : 30,
      teacher: null,
      students: null,
    };

    try {
      const newClass = await createClass(newClassData);
      setClasses((prev) => [...prev, newClass]);
      closeAddClassModal();
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  // ===== Delete Class Handler =====
  const handleDeleteClass = async (index, classId) => {
    try {
      await deleteClass(classId);
      setClasses((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  // ===== Teacher Modal Handlers =====
  const openTeacherModal = (index) => {
    setTeacherModal({ open: true, classIndex: index, teacherId: "" });
  };

  const closeTeacherModal = () => {
    setTeacherModal({ open: false, classIndex: null, teacherId: "" });
  };

  const handleTeacherChange = (e) => {
    setTeacherModal((prev) => ({ ...prev, teacherId: e.target.value }));
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const index = teacherModal.classIndex;
    const classId = classes[index]._id;
    const updatedData = { teacher: teacherModal.teacherId };
    try {
      await updateClass(classId, updatedData);
      setClasses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], teacher: teacherModal.teacherId };
        return updated;
      });
      closeTeacherModal();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  // ===== Student Modal Handlers =====
  const openStudentModal = (index) => {
    setStudentModal({ open: true, classIndex: index, selectedStudents: [] });
  };

  const closeStudentModal = () => {
    setStudentModal({ open: false, classIndex: null, selectedStudents: [] });
  };

  const handleStudentDropdownChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setStudentModal((prev) => ({ ...prev, selectedStudents: selectedOptions }));
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const index = studentModal.classIndex;
    const classId = classes[index]._id;

    const existingStudents = Array.isArray(classes[index].students)
      ? classes[index].students
      : [];

    const mergedStudents = Array.from(
      new Set([...existingStudents, ...studentModal.selectedStudents])
    );

    const updatedData = { students: mergedStudents };

    try {
      await updateClass(classId, updatedData);
      setClasses((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], students: mergedStudents };
        return updated;
      });
      closeStudentModal();
    } catch (error) {
      console.error("Error updating students:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Class Management</h1>
      <p className="mb-6 text-gray-300">
        Here you can manage classes, schedules, and related information.
      </p>

      <ul className="mt-4 space-y-4">
        {classes &&
          classes.filter((cls) => cls).map((cls, index) => (
            <li
              key={cls._id || index}
              className="p-4 border border-gray-700 rounded shadow-sm bg-gray-800"
            >
              <p>
                <strong>Name:</strong> {cls.name}
              </p>
              <p>
                <strong>Year:</strong> {cls.year}
              </p>
              <p>
                <strong>Student Fees:</strong> {cls.studentFees}
              </p>
              <p>
                <strong>Capacity:</strong> {cls.capacity || 30}
              </p>
              <p>
                <strong>Teacher:</strong>{" "}
                {cls.teacher ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded">
                    {teacherNames[cls.teacher] || "Loading..."}
                  </span>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Students:</strong>{" "}
                {Array.isArray(cls.students) && cls.students.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {cls.students.slice(0, 5).map((studentId) => (
                      <span
                        key={studentId}
                        className="bg-purple-600 text-white px-2 py-1 rounded"
                      >
                        {studentId}
                      </span>
                    ))}
                    {cls.students.length > 5 && (
                      <span className="bg-gray-600 text-white px-2 py-1 rounded">
                        +{cls.students.length - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  "N/A"
                )}
              </p>
              <div className="mt-2 flex space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 transition-colors"
                  onClick={() => openTeacherModal(index)}
                >
                  Add Teacher
                </button>
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-500 transition-colors"
                  onClick={() => openStudentModal(index)}
                >
                  Add Student
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition-colors"
                  onClick={() => handleDeleteClass(index, cls._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>

      <button
        className="fixed bottom-9 right-9 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors"
        onClick={openAddClassModal}
      >
        Add Class
      </button>

      {showAddClassModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
            <form onSubmit={handleClassSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300">
                  Class Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={classFormData.name}
                  onChange={handleClassChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="year" className="block text-gray-300">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  id="year"
                  value={classFormData.year}
                  onChange={handleClassChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="studentFees" className="block text-gray-300">
                  Student Fees
                </label>
                <input
                  type="number"
                  name="studentFees"
                  id="studentFees"
                  value={classFormData.studentFees}
                  onChange={handleClassChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="capacity" className="block text-gray-300">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  id="capacity"
                  value={classFormData.capacity}
                  onChange={handleClassChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                  placeholder="Default is 30"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeAddClassModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {teacherModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Teacher</h2>
            <form onSubmit={handleTeacherSubmit}>
              <div className="mb-4">
                <label htmlFor="teacherSelect" className="block text-gray-300">
                  Select Teacher
                </label>
                <select
                  id="teacherSelect"
                  name="teacherSelect"
                  value={teacherModal.teacherId}
                  onChange={handleTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                >
                  <option value="">Select a teacher</option>
                  {availableTeachers.map((teacher) =>
                    teacher ? (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeTeacherModal}
                  className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {studentModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Student(s)</h2>
            <div className="mb-4">
              <label htmlFor="studentSelect" className="block text-gray-300 mb-2">
                Select Student(s)
              </label>
              <select
                id="studentSelect"
                name="studentSelect"
                multiple
                value={studentModal.selectedStudents}
                onChange={handleStudentDropdownChange}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              >
                {availableStudents.length > 0 ? (
                  availableStudents.map((student) =>
                    student ? (
                      <option key={student._id} value={student._id}>
                        {student._id}
                      </option>
                    ) : null
                  )
                ) : (
                  <option>Loading...</option>
                )}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeStudentModal}
                className="mr-2 px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStudentSubmit}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-500 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Class;



import React, { useEffect, useState } from "react";
import { 
  getAllTeacher, 
  updateTeacher, 
  // createTeacher, 
  deleteTeacher 
} from "../../../services/oprations/teacherAPI";
import { getClassByID, getAllClass } from "../../../services/oprations/classAPI";
import ListDisplay from "../../common/ListDisplay";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [classNames, setClassNames] = useState({});

  // Modal state for adding a new teacher
 // const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  // Modal state for editing a teacher; now using teacherId instead of index
  const [showEditTeacherModal, setShowEditTeacherModal] = useState({
    open: false,
    teacherData: {},
    teacherId: null,
  });

  // // State for new teacher data (Add Teacher Modal)
  // const [newTeacherData, setNewTeacherData] = useState({
  //   name: "",
  //   gender: "Male",
  //   dob: "",
  //   email: "",
  //   salary: "",
  //   assignedClass: "",
  // });

  // State for available classes for the "Assigned Class" dropdown
  const [availableClasses, setAvailableClasses] = useState([]);

  // State for search inputs
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchClass, setSearchClass] = useState("");

  // Fetch available classes for recommendations and filtering
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClass();
        setAvailableClasses(res);
      } catch (error) {
        console.error("Could not fetch classes for dropdown", error);
      }
    };
    fetchClasses();
  }, []);

  // // ===== Add Teacher Modal Handlers =====
  // const openAddTeacherModal = () => {
  //   setShowAddTeacherModal(true);
  // };

  // const closeAddTeacherModal = () => {
  //   setShowAddTeacherModal(false);
  //   setNewTeacherData({
  //     name: "",
  //     gender: "Male",
  //     dob: "",
  //     email: "",
  //     salary: "",
  //     assignedClass: "",
  //   });
  // };

  // const handleNewTeacherChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewTeacherData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleAddTeacherSubmit = async (e) => {
  //   e.preventDefault();
  //   const teacherData = {
  //     ...newTeacherData,
  //     salary: Number(newTeacherData.salary),
  //     assignedClass: newTeacherData.assignedClass || null,
  //   };

  //   try {
  //     const createdTeacher = await createTeacher(teacherData);
  //     setTeachers((prev) => [...prev, createdTeacher]);
  //     closeAddTeacherModal();
  //   } catch (error) {
  //     console.error("Error creating teacher:", error);
  //   }
  // };

  // ===== Edit Teacher Modal Handlers =====
  const openEditTeacherModal = (teacherId) => {
    const teacher = teachers.find(
      (t) => t._id === teacherId || t.id === teacherId
    );
    setShowEditTeacherModal({
      open: true,
      teacherData: teacher,
      teacherId: teacherId,
    });
  };

  // Fetch teachers and their assigned class names
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await getAllTeacher();
        console.log("Fetched teachers:", res);
        setTeachers(res);

        // Fetch class names for each assigned class
        const classDetails = {};
        await Promise.all(
          res.map(async (teacher) => {
            if (teacher.assignedClass) {
              if (!classDetails[teacher.assignedClass]) {
                const classRes = await getClassByID(teacher.assignedClass);
                classDetails[teacher.assignedClass] = classRes.name;
              }
            }
          })
        );
        setClassNames(classDetails);
      } catch (error) {
        console.error("Could not fetch Teacher Details", error);
      }
    };

    fetchTeachers();
  }, [showEditTeacherModal]);

  const closeEditTeacherModal = () => {
    setShowEditTeacherModal({
      open: false,
      teacherData: {},
      teacherId: null,
    });
  };

  const handleEditTeacherChange = (e) => {
    const { name, value } = e.target;
    setShowEditTeacherModal((prev) => ({
      ...prev,
      teacherData: { ...prev.teacherData, [name]: value },
    }));
  };

  const handleEditTeacherSubmit = async (e) => {
    e.preventDefault();
    const { teacherData, teacherId } = showEditTeacherModal;
    const updatedData = {
      ...(teacherData.name && { name: teacherData.name }),
      ...(teacherData.gender && { gender: teacherData.gender }),
      ...(teacherData.dob && { dob: teacherData.dob }),
      ...(teacherData.email && { email: teacherData.email }),
      ...(teacherData.salary && { salary: Number(teacherData.salary) }),
      assignedClass:
        teacherData.assignedClass !== undefined && teacherData.assignedClass !== ""
          ? teacherData.assignedClass
          : null,
    };
    try {
      const updatedTeacher = await updateTeacher(teacherId, updatedData);
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher._id === teacherId || teacher.id === teacherId
            ? updatedTeacher
            : teacher
        )
      );
      closeEditTeacherModal();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  // ===== Delete Teacher Handler =====
  const handleDeleteTeacher = async (teacherId) => {
    try {
      await deleteTeacher(teacherId);
      setTeachers((prev) =>
        prev.filter((teacher) => (teacher._id || teacher.id) !== teacherId)
      );
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  // Filter teachers based on search inputs (teacher name and assigned class)
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesName = teacher.name
      .toLowerCase()
      .includes(searchTeacher.toLowerCase());
    const matchesClass =
      searchClass === "" || teacher.assignedClass === searchClass;
    return matchesName && matchesClass;
  });

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Teacher Management</h1>
      <p className="mb-6 text-gray-300">
        Manage teacher profiles and related information.
      </p>

      {/* Search Inputs */}
      <div className="mb-4">
        <label htmlFor="searchTeacher" className="block text-gray-300 mb-2">
          Search by Teacher Name
        </label>
        <input
          type="text"
          id="searchTeacher"
          value={searchTeacher}
          onChange={(e) => setSearchTeacher(e.target.value)}
          placeholder="Enter teacher name..."
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="searchClass" className="block text-gray-300 mb-2">
          Filter by Class
        </label>
        <select
          id="searchClass"
          value={searchClass}
          onChange={(e) => setSearchClass(e.target.value)}
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
        title="Teachers List"
        items={filteredTeachers}
        renderItem={(teacher) => (
          <div className="p-4 border-b border-gray-700">
            <p>
              <strong>Name:</strong> {teacher?.name}
            </p>
            <p>
              <strong>Gender:</strong> {teacher?.gender}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {teacher?.dob
                ? new Date(teacher.dob).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {teacher?.email}
            </p>
            <p>
              <strong>Salary:</strong> ₹{teacher?.salary}
            </p>
            <p>
              <strong>Assigned Class:</strong>{" "}
              {teacher?.assignedClass
                ? availableClasses.find(
                    (cls) => cls._id === teacher.assignedClass
                  )?.name || "Loading..."
                : "Not Assigned"}
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors"
                onClick={() => openEditTeacherModal(teacher._id || teacher.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                onClick={() =>
                  handleDeleteTeacher(teacher._id || teacher.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        )}
      />

      {/* Floating "Add Teacher" Button
      <button
        className="fixed bottom-9 right-9 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-full shadow-lg transition-colors"
        onClick={openAddTeacherModal}
      >
        Add Teacher
      </button> */}

      {/* ===== Add Teacher Modal =====
      {showAddTeacherModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Teacher</h2>
            <form onSubmit={handleAddTeacherSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newTeacherData.name}
                  onChange={handleNewTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={newTeacherData.gender}
                  onChange={handleNewTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
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
                  value={newTeacherData.dob}
                  onChange={handleNewTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
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
                  value={newTeacherData.email}
                  onChange={handleNewTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="salary" className="block text-gray-300">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  id="salary"
                  value={newTeacherData.salary}
                  onChange={handleNewTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="assignedClass" className="block text-gray-300">
                  Assigned Class
                </label>
                <select
                  name="assignedClass"
                  id="assignedClass"
                  value={newTeacherData.assignedClass}
                  onChange={handleNewTeacherChange}
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
                  onClick={closeAddTeacherModal}
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

      {/* ===== Edit Teacher Modal ===== */}
      {showEditTeacherModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Teacher</h2>
            <form onSubmit={handleEditTeacherSubmit}>
              <div className="mb-4">
                <label htmlFor="editName" className="block text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="editName"
                  value={showEditTeacherModal.teacherData?.name || ""}
                  onChange={handleEditTeacherChange}
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
                  value={showEditTeacherModal.teacherData?.gender || "Male"}
                  onChange={handleEditTeacherChange}
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
                    showEditTeacherModal.teacherData?.dob
                      ? new Date(showEditTeacherModal.teacherData.dob)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleEditTeacherChange}
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
                  value={showEditTeacherModal.teacherData?.email || ""}
                  onChange={handleEditTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editSalary" className="block text-gray-300">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  id="editSalary"
                  value={showEditTeacherModal.teacherData?.salary || ""}
                  onChange={handleEditTeacherChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 mt-1 text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="editAssignedClass" className="block text-gray-300">
                  Assigned Class
                </label>
                <select
                  name="assignedClass"
                  id="editAssignedClass"
                  value={showEditTeacherModal.teacherData?.assignedClass || ""}
                  onChange={handleEditTeacherChange}
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
                  onClick={closeEditTeacherModal}
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

export default Teacher;

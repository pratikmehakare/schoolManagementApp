import React, { useEffect, useState } from "react";
import { getAllClass } from "../../../services/oprations/classAPI";
import { getTeacherByID } from "../../../services/oprations/teacherAPI";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [teacherNames, setTeacherNames] = useState({}); // Cache for teacher names
  const [error, setError] = useState(null);

  // Fetch all classes and then fetch teacher names for assigned teachers
  useEffect(() => {
    const fetchClassesAndTeachers = async () => {
      try {
        const classData = await getAllClass();
        setClasses(classData);

        // Collect unique teacher IDs from the fetched classes
        const teacherIds = Array.from(
          new Set(classData.map((cls) => cls.teacher).filter(Boolean))
        );

        const namesMap = {};
        await Promise.all(
          teacherIds.map(async (id) => {
            try {
              const teacher = await getTeacherByID(id);
              namesMap[id] = teacher.name;
            } catch (err) {
              namesMap[id] = "N/A";
            }
          })
        );
        setTeacherNames(namesMap);
      } catch (err) {
        console.error("Could not fetch class details", err);
        setError("Unable to fetch class details.");
      }
    };

    fetchClassesAndTeachers();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold mb-4">Class Management</h1>
      <p className="mb-6 text-gray-300">
        View all classes and their details.
      </p>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="mt-4 space-y-4">
        {classes.map((cls, index) => (
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
              {cls.teacher
                ? teacherNames[cls.teacher] || "Loading..."
                : "N/A"}
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Class;

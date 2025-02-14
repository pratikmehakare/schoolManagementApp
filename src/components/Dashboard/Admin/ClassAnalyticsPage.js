import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllClass } from "../../../services/oprations/classAPI"; // API helper to fetch classes list
import { getClassAnalytics } from "../../../services/oprations/analyticsAPI"; // API helper to fetch analytics for a class

// Register Chart.js components for the Doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

const ClassAnalyticsPage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classData, setClassData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all classes when the component mounts and select the first class by default
  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const data = await getAllClass();
        setClasses(data);
        if (data && data.length > 0) {
          // Automatically select and load analytics for the first class
          handleClassClick(data[0]);
        }
      } catch (err) {
        setError("Unable to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Handle clicking a class or default selection: fetch its analytics and details
  const handleClassClick = async (cls) => {
    setSelectedClass(cls);
    setLoadingAnalytics(true);
    try {
      const data = await getClassAnalytics(cls._id);
      setClassData(data.classDetails);
      setAnalytics(data.genderAnalytics);
    } catch (err) {
      setError("Unable to load class analytics.");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Prepare Doughnut chart data if analytics exists
  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [analytics?.Male || 0, analytics?.Female || 0],
        backgroundColor: ["#4A90E2", "#F76C6C"],
        hoverBackgroundColor: ["#357ABD", "#E05555"],
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar: Classes List */}
      <aside className="w-full md:w-1/4 border-r border-gray-700 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Classes List</h2>
        {loadingClasses ? (
          <p className="text-gray-300">Loading classes...</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {classes.map((cls) => (
              <li
                key={cls._id}
                className={`py-2 cursor-pointer hover:bg-gray-700 text-white ${
                  selectedClass?._id === cls._id ? "bg-blue-700" : ""
                }`}
                onClick={() => handleClassClick(cls)}
              >
                {cls.name}
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Content: Analytics */}
      <main className="flex-1 overflow-y-auto p-4">
        {loadingAnalytics ? (
          <p className="text-gray-300">Loading analytics...</p>
        ) : classData ? (
          <div className="space-y-6">
            <h1 className="text-4xl font-bold mb-4 text-white">
              {classData.name} Analytics
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Class Details */}
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Class Information
                </h2>
                <p className="text-gray-300">
                  <span className="font-bold text-white">Year:</span> {classData.year}
                </p>
                <p className="mt-2 text-gray-300">
                  <span className="font-bold text-white">Teacher:</span>{" "}
                  {classData.teacher?.name || "N/A"}
                </p>
                <p className="mt-2 text-gray-300">
                  <span className="font-bold text-white">Total Students:</span>{" "}
                  {classData.students.length}
                </p>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Students List
                  </h3>
                  <ul className="divide-y divide-gray-700 max-h-64 overflow-y-auto">
                    {classData.students.map((student) => (
                      <li
                        key={student._id}
                        className="py-2 flex justify-between text-gray-300"
                      >
                        <span>{student.name}</span>
                        <span className="text-sm text-gray-400">
                          {student.gender}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gender Distribution Chart */}
              <div className="bg-gray-800 p-6 rounded-lg shadow flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  Gender Distribution
                </h2>
                <div className="w-64 h-64">
                  <Doughnut data={genderData} />
                </div>
                <div className="mt-4 w-full">
                  <div className="flex items-center justify-around">
                    <div className="flex items-center text-white">
                      <span className="inline-block w-4 h-4 bg-blue-500 mr-2"></span>
                      <span>Male: {analytics?.Male || 0}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>
                      <span>Female: {analytics?.Female || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">Select a class to view analytics.</p>
        )}
      </main>
    </div>
  );
};

export default ClassAnalyticsPage;

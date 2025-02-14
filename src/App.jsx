import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { getUserDetails } from "./services/oprations/profileAPI";
import Navbar from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Teacher Components
import TeacherDashboard from "./pages/teacherDashboard";
import Note from "./components/Dashboard/Teacher/Note";
import Teachert from "./components/Dashboard/Teacher/Class";
import Studentt from "./components/Dashboard/Teacher/Student";
import Assignment from "./components/Dashboard/Teacher/Assignment";

//Studnet
import StudentDashboard from "./pages/studentDashboard";
import NoteS from "./components/Dashboard/Student/Note";
import ClassS from "./components/Dashboard/Student/Class";
import AssignmentS from "./components/Dashboard/Student/Assignment";

//admin
import Dashboard from "./pages/adminDashboard";
import Class from "./components/Dashboard/Admin/Class";
import Teacher from "./components/Dashboard/Admin/Teacher";
import Student from "./components/Dashboard/Admin/Student";
import ClassAnalyticsPage from "./components/Dashboard/Admin/ClassAnalyticsPage";
import FinancialAnalyticsPage from "./components/Dashboard/Admin/FinancialAnalyticsPage";

//auth
import LoginPage from "./components/Auth/Login";
import RegisterPage from "./components/Auth/Register";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.profile);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"));
      dispatch(getUserDetails(token, navigate));
    }
  }, []);

  useEffect(() => {
    console.log("userapp", user);
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          {/* Auth */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />

          {/* Admin Dashboard Routes */}
          {user?.role === "Admin" && (
            <Route path="/dashboard" element={<Dashboard />}>
              <Route
                index
                element={<Navigate to="/dashboard/class" replace />}
              />
              <Route path="class" element={<Class />} />
              <Route path="teacher" element={<Teacher />} />
              <Route path="student" element={<Student />} />
              <Route path="class-analytics" element={<ClassAnalyticsPage />} />
              <Route
                path="financial-analytics"
                element={<FinancialAnalyticsPage />}
              />
            </Route>
          )}

          {/* Student Dashboard Routes */}
          {user?.role === "Student" && (
            <Route path="/student-dashboard" element={<StudentDashboard />}>
              <Route
                index
                element={<Navigate to="/student-dashboard/class" replace />}
              />
              <Route path="class" element={<ClassS />} />
              <Route path="assignment" element={<AssignmentS />} />
              <Route path="note" element={<NoteS />} />
            </Route>
          )}

          {/* Teacher Dashboard Routes */}
          {user?.role === "Teacher" && (
            <Route path="/teacher-dashboard" element={<TeacherDashboard />}>
              <Route
                index
                element={<Navigate to="/teacher-dashboard/class" replace />}
              />
              <Route path="class" element={<Teachert />} />
              <Route path="student" element={<Studentt />} />
              <Route path="assignment" element={<Assignment />} />
              <Route path="note" element={<Note />} />
            </Route>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default App;

import { Outlet } from "react-router-dom"
import Sidebar from "../components/Dashboard/Student/studentSideBar"

const studentDashboard = () => {
  return (
    
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default studentDashboard


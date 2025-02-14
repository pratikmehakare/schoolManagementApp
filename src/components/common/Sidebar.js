import { NavLink, useNavigate } from "react-router-dom"
import {LogOut } from "lucide-react"
import { logout } from "../../services/oprations/authAPI"
import { useDispatch } from "react-redux";

const Sidebar = ({items}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const handleLogout=()=>{
    dispatch(logout(navigate))
  }

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 py-2 px-4 rounded transition duration-200 text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  )
}

export default Sidebar


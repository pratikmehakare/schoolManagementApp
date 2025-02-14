import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { authEndpoints } from "../apis"

const {
  REGISTER_API,LOGIN_API
} = authEndpoints

export function register(
  name,
  email,
  password,
  role,
  gender,
  dob,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Wait..,Connecting to backend")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", REGISTER_API, {
        name,
        email,
        password,
        role,
        gender,
        dob
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed",error)
      navigate("/register")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  
  return async (dispatch) => {
    const toastId = toast.loading("Wait..,Connecting to backend")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      dispatch(setUser({ ...response.data.user }))
      // const userImage = response.data?.user?.image
      //   ? response.data.user.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      // dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", JSON.stringify(response.data.token))
      
      const userRole = response.data.user.role;
      if (userRole === "Teacher") {
        navigate("/teacher-dashboard");
      } else if (userRole === "Student") {
        navigate("/student-dashboard");
      } else if (userRole === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

//import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../apis";

const  {GET_ALL_STUDENT_API,GET_STUDENT_BY_ID_API, UPDATE_STUDENT_API, DELETE_STUDENT_API, CREATE_STUDENT_API}  = studentEndpoints;

export const updateStudent = async (Id, updatedData) => {
  //const toastId = toast.loading("Updating student...");
  let result = null;
  try {

    const response = await apiConnector("PUT", `${UPDATE_STUDENT_API}/${Id}`, updatedData);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("student updated successfully!");
  } catch (error) {
    console.error("UPDATE_TEACHER_API ERROR:", error);
    //toast.error("Failed to update");
  } finally {
    //toast.dismiss(toastId);
  }
  return result;
};

export const createStudent = async (data) => {
  //const toastId = toast.loading("Creating student...");
  let result = null;

  try {
    console.log("api",CREATE_STUDENT_API)
    const response = await apiConnector("POST", CREATE_STUDENT_API, data);

    if (!response?.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("student created successfully!");
  } catch (error) {
    console.error("CREATE_STUDENT_API ERROR:", error);
    //toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const deleteStudent = async (Id) => {
  //const toastId = toast.loading("Deleting student...");
  let result = null;

  try {

    const response = await apiConnector("DELETE", `${DELETE_STUDENT_API}/${Id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete class");
    }

    result = response.data;
    //toast.success("student deleted successfully");
  } catch (error) {
    console.error("DELETE_STUDENT_API ERROR:", error);
    //toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const getStudentByID = async (Id) => {
  //const toastId = toast.loading("Fetching student...");
  let result = null;
  try {

    const response = await apiConnector("GET", `${GET_STUDENT_BY_ID_API}/${Id}`);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
   // toast.success("student fetched successfully!");
  } catch (error) {
    console.error("GET_STUDENT_BY_ID_API ERROR:", error);
    //toast.error("Failed to fetch");
  } finally {
    //toast.dismiss(toastId);
  }
  return result;
};

export const getAllStudent = async () => {
   // const toastId = toast.loading("Loading...");
    let result = [];
  
    try {
      const response = await apiConnector("GET", GET_ALL_STUDENT_API);
  
      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected response format.");
      }
  
      result = response.data;
    } catch (error) {
      console.error("GET_ALL_TEACHER_API ERROR:", error);
     // toast.error(error.message || "Something went wrong!");
    } finally {
     // toast.dismiss(toastId);
    }
  
    return result;
  };
  

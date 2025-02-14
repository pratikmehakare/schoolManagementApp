//import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { teacherEndpoints } from "../apis";

const  {GET_ALL_TEACHER_API, GET_TEACHER_BY_ID_API, UPDATE_TEACHER_API,DELETE_TEACHER_API,CREATE_TEACHER_API }  = teacherEndpoints;

export const updateTeacher = async (Id, updatedData) => {
  //const toastId = toast.loading("Updating teacher...");
  let result = null;
  try {
  
    const response = await apiConnector("PUT", `${UPDATE_TEACHER_API}/${Id}`, updatedData);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("teacher updated successfully!");
  } catch (error) {
    console.error("UPDATE_TEACHER_API ERROR:", error);
    //toast.error("Failed to update");
  } finally {
    //toast.dismiss(toastId);
  }
  return result;
};

export const createTeacher = async (data) => {
  //const toastId = toast.loading("Creating teacher...");
  let result = null;

  try {

    console.log("api",CREATE_TEACHER_API)
    const response = await apiConnector("POST", CREATE_TEACHER_API, data);

    if (!response?.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("Teacher created successfully!");
  } catch (error) {
    console.error("CREATE_TEACHER_API ERROR:", error);
    //toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const deleteTeacher = async (Id) => {
  //const toastId = toast.loading("Deleting teacher...");
  let result = null;

  try {
    const response = await apiConnector("DELETE", `${DELETE_TEACHER_API}/${Id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete class");
    }

    result = response.data;
    //toast.success("teacher deleted successfully");
  } catch (error) {
    console.error("DELETE_TEACHER_API ERROR:", error);
    //toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const getTeacherByID = async (Id) => {
  //const toastId = toast.loading("Fetching teacher...");
  let result = null;
  try {
  
    const response = await apiConnector("GET", `${GET_TEACHER_BY_ID_API}/${Id}`);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("teacher fetched successfully!");
  } catch (error) {
    console.error("GET_TEACHER_BY_ID_API ERROR:", error);
    //toast.error("Failed to fetch");
  } finally {
   // toast.dismiss(toastId);
  }
  return result;
};

export const getAllTeacher = async () => {
    //const toastId = toast.loading("Loading...");
    let result = [];
  
    try {
      const response = await apiConnector("GET", GET_ALL_TEACHER_API);

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
  

// import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { classEndpoints } from "../apis";

const  {GET_ALL_CLASS_API,GET_CLASS_BY_ID_API,UPDATE_CLASS_API, DELETE_CLASS_API, CREATE_CLASS_API }  = classEndpoints;

export const getClassByID = async (classId) => {
  //const toastId = toast.loading("Fetching class...");
  let result = null;
  try {

    const response = await apiConnector("GET", `${GET_CLASS_BY_ID_API}/${classId}`);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    //toast.success("Class fetched successfully!");
  } catch (error) {
    console.error("GET_CLASS_BY_ID_API ERROR:", error);
    //toast.error("Failed to fetch");
  } finally {
    //toast.dismiss(toastId);
  }
  return result;
};

export const updateClass = async (classId, updatedData) => {
  //const toastId = toast.loading("Updating class...");
  let result = null;
  try {

    const response = await apiConnector("PUT", `${UPDATE_CLASS_API}/${classId}`, updatedData);

    if (!response || !response.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
   // toast.success("Class updated successfully!");
  } catch (error) {
    console.error("UPDATE_CLASS_API ERROR:", error);
   // toast.error("Failed to update");
  } finally {
    //toast.dismiss(toastId);
  }
  return result;
};

export const createClass = async (classData) => {
 // const toastId = toast.loading("Creating class...");
  let result = null;

  try {

    console.log("api",CREATE_CLASS_API)
    const response = await apiConnector("POST", CREATE_CLASS_API, classData);

    if (!response?.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
   // toast.success("Class created successfully!");
  } catch (error) {
    console.error("CREATE_CLASS_API ERROR:", error);
    //toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const deleteClass = async (classId) => {
  //const toastId = toast.loading("Deleting class...");
  let result = null;

  try {

    const response = await apiConnector("DELETE", `${DELETE_CLASS_API}/${classId}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete class");
    }

    result = response.data;
   // toast.success("Class deleted successfully");
  } catch (error) {
    console.error("DELETE_CLASS_API ERROR:", error);
   // toast.error(error.message || "Something went wrong!");
  } finally {
   // toast.dismiss(toastId);
  }

  return result;
};

export const getAllClass = async () => {
    //const toastId = toast.loading("Loading...");
    let result = [];
  
    try {
      const response = await apiConnector("GET", GET_ALL_CLASS_API);

      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected response format.");
      }
  
      result = response.data;
    } catch (error) {
      console.error("GET_ALL_CLASS_API ERROR:", error);
      //toast.error(error.message || "Something went wrong!");
    } finally {
     // toast.dismiss(toastId);
    }
  
    return result;
  };


  

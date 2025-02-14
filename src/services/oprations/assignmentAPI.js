import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { assignmentEndpoints } from "../apis";
const  { GET_ALL_ASSIGNMENT_API, CREATE_ASSIGNMENT_API, DELETE_ASSIGNMENT_API }  = assignmentEndpoints;

export const getAllAssignment = async () => {
    //const toastId = toast.loading("Loading...");
    let result = [];
  
    try {
      const response = await apiConnector("GET", GET_ALL_ASSIGNMENT_API);

      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected response format.");
      }
  
      result = response.data;
    } catch (error) {
      console.error("GET_ALL_ASSIGNMENT_API ERROR:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
     // toast.dismiss(toastId);
    }
  
    return result;
  };

export const createAssignment = async (data) => {
 // const toastId = toast.loading("Creating student...");
  let result = null;

  try {
 
    console.log("api",CREATE_ASSIGNMENT_API)
    const response = await apiConnector("POST", CREATE_ASSIGNMENT_API, data);

    if (!response?.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    toast.success("student created successfully!");
  } catch (error) {
    console.error("CREATE_ASSIGNMENT_API ERROR:", error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const deleteAssignment = async (Id) => {
  //const toastId = toast.loading("Deleting student...");
  let result = null;

  try {

    const response = await apiConnector("DELETE", `${DELETE_ASSIGNMENT_API}/${Id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete class");
    }

    result = response.data;
    toast.success("student deleted successfully");
  } catch (error) {
    console.error("DELETE_ASSIGNMENT_API ERROR:", error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};


  

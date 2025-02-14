import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { noteEndpoints } from "../apis";
const  { GET_ALL_NOTE_API, CREATE_NOTE_API, DELETE_NOTE_API }  = noteEndpoints;

export const getAllNote = async () => {
    //const toastId = toast.loading("Loading...");
    let result = [];
  
    try {
      const response = await apiConnector("GET", GET_ALL_NOTE_API);

      if (!Array.isArray(response?.data)) {
        throw new Error("Unexpected response format.");
      }
  
      result = response.data;
    } catch (error) {
      console.error("GET_ALL_NOTE_API ERROR:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
     // toast.dismiss(toastId);
    }
  
    return result;
  };

export const createNote = async (data) => {
  //const toastId = toast.loading("Creating student...");
  let result = null;

  try {

    console.log("api",CREATE_NOTE_API)
    const response = await apiConnector("POST", CREATE_NOTE_API, data);

    if (!response?.data) {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
    toast.success("student created successfully!");
  } catch (error) {
    console.error("CREATE_NOTE_API ERROR:", error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const deleteNote = async (Id) => {
  //const toastId = toast.loading("Deleting student...");
  let result = null;

  try {

    const response = await apiConnector("DELETE", `${DELETE_NOTE_API}/${Id}`);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to delete class");
    }

    result = response.data;
    toast.success("student deleted successfully");
  } catch (error) {
    console.error("DELETE_NOTE_API ERROR:", error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};


  

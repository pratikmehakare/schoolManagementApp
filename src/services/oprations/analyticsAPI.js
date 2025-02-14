import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { analyticsEndpoints } from "../apis";

const { GET_CLASS_ANALYTICS_API,GET_FINANCIAL_ANALYTICS_API } = analyticsEndpoints;

export const getClassAnalytics = async (id) => {
  //const toastId = toast.loading("Loading class analytics...");
  let result = {};

  try {
    const response = await apiConnector("GET", `${GET_CLASS_ANALYTICS_API}/${id}`);

    if (!response?.data || typeof response.data !== "object") {
      throw new Error("Unexpected response format.");
    }

    result = response.data;
  } catch (error) {
    console.error("GET_CLASS_ANALYTICS_API ERROR:", error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    //toast.dismiss(toastId);
  }

  return result;
};

export const getFinancialAnalytics = async (params) => {
   // const toastId = toast.loading("Loading financial analytics...");
    let result = {};
  
    try {

      const queryString = new URLSearchParams(params).toString();
      const response = await apiConnector("GET", `${GET_FINANCIAL_ANALYTICS_API}?${queryString}`);

      if (!response?.data || typeof response.data !== "object") {
        throw new Error("Unexpected response format.");
      }
  
      result = response.data;
    } catch (error) {
      console.error("GET_FINANCIAL_ANALYTICS_API ERROR:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      //toast.dismiss(toastId);
    }
  
    return result;
  };
  
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function getResearchAnswer(query: string) {
  try {
    const payload = { query };

    const apiURL = import.meta.env.VITE_API_BASE_URL;
    // Calling the researcher endpoint as specified by the curl command
    const response = await axios.post(`${apiURL}/default/researcher`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error("Invalid response format: Missing expected data");
    }
  } catch (error: any) {
    let errorResponse: any = {
      statusCode: 500,
      message: "An unexpected error occurred",
    };

    if (axios.isAxiosError(error)) {
      if (error.response) {
        errorResponse = {
          statusCode: error.response.status,
          message:
            error.response.data?.message ||
            `API request failed with status ${error.response.status}`,
          details: error.response.data || {},
        };
      } else if (error.request) {
        errorResponse.message = "No response received from the server";
      } else {
        errorResponse.message = "Error in setting up the request";
      }
    } else {
      errorResponse.message = error.message || "Unexpected error";
    }

    console.error("API Error:", errorResponse);
    throw errorResponse;
  }
}

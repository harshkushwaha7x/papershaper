/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export async function getAnswerKey(formData: {
  id: string;
  board: string;
  classLevel: string;
  selectedSubjects: string;
  chapter: string;
  paperType: string;
  hit_count: number;
  is_logedIn: boolean;
  question_paper: string;
}) {
  try {
    const payload = {
      id: formData.id,
      Board: formData.board,
      Class: formData.classLevel,
      Subject: formData.selectedSubjects,
      Chapter: formData.chapter,
      Prompt_Type: formData.paperType,
      hit_count: formData.hit_count,
      is_logedIn: formData.is_logedIn,
      answer: true,
      question_paper: formData.question_paper,
    };

    const apiURL = import.meta.env.VITE_API_BASE_URL;

    const response = await axios.post(`${apiURL}/process`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200 && response.data?.result) {
      return response.data.result;
    } else {
      throw new Error("Invalid response format: Missing 'result' field");
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

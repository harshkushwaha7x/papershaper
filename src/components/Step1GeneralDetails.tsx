/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import InputField from "../utils/common/InputField";
import SelectField from "../utils/common/SelectField";
import { FormDataType } from "../pages/MockPaperCreatorPage";
import { toast } from "react-toastify";
// import axios from "axios";

interface Step1Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onNext: () => void;
}

const Step1GeneralDetails: React.FC<Step1Props> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: FormDataType) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    // const { email, phoneNumber } = formData;

    // if (!email || !phoneNumber) {
    //   toast.error("Please fill out all required fields.");
    //   return;
    // }

    // // Email validation regex
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailRegex.test(email)) {
    //   toast.error("Please enter a valid email address.");
    //   return;
    // }

    // // Phone number validation regex (10-digit number without country code)
    // const phoneRegex = /^\d{10}$/;
    // if (!phoneRegex.test(phoneNumber)) {
    //   toast.error("Please enter a valid 10-digit phone number.");
    //   return;
    // }

    setIsLoading(true);

    try {
      //   const payload = {
      //     firstName: formData.firstName,
      //     lastName: formData.lastName,
      //     gender: formData.gender,
      //     email: formData.email,
      //     phoneNumber: formData.phoneNumber,
      //     reason: formData.reason,
      //   };

      //   const response = await axios.post("/api/append-data", payload, {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      //   if (response.data.status === "success") {
      //     onNext();
      //   } else {
      //     toast.error(
      //       response.data.message || "There was an error submitting your details."
      //     );
      //   }
      onNext();
    } catch (error: any) {
      console.error("Error submitting form data:", error);
      toast.error(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <InputField
        label="Reason for Creating Mock Paper"
        name="reason"
        type="textarea"
        value={formData.reason || ""}
        onChange={handleChange}
      />
      <div className="grid grid-cols-2 gap-6">
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <SelectField
          label="Gender"
          name="gender"
          options={["Male", "Female", "Other"]}
          value={formData.gender || ""}
          onChange={handleChange}
        />
        <InputField
          label="Email*"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
        />
      </div>
      <InputField
        label="Phone Number*"
        name="phoneNumber"
        type="number"
        value={formData.phoneNumber || ""}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        onClick={handleNext}
        className={`mt-4 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-opacity duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Next"
        )}
      </button>
    </div>
  );
};

export default Step1GeneralDetails;

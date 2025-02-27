import React from "react";

interface LoadingSpinnerProps {
  message: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-96">
    <div className="relative">
      <svg
        className="animate-spin h-16 w-16 text-green-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
      </svg>
    </div>
    <p className="text-green-700 mt-4">{message}</p>
  </div>
);

export default LoadingSpinner;

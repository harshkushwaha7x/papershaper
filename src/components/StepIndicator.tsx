import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: "Mock Paper Details", number: 1 },
    { label: "Review and Generate", number: 2 },
    { label: "Answer Key", number: 3 },
  ];

  return (
    <div className="flex justify-between items-center mb-8 w-full max-w-2xl mx-auto">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                currentStep === step.number
                  ? "text-white bg-green-600"
                  : "text-gray-500 bg-gray-200"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`hidden sm:inline ${
                currentStep === step.number
                  ? "text-green-600 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className="flex-1 border-t-2 mx-4"
              style={{
                borderColor: currentStep > step.number ? "green" : "gray",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;

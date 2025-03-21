import { FC, useState, useEffect } from "react";

// Expanded array of dynamic loading messages for enhanced UX
const loadingMessages: string[] = [
  "Loading research response...",
  "Crunching the data...",
  "Gathering insights...",
  "Preparing your personalized report...",
  "Just a moment...",
  "Finishing touches...",
];

/**
 * Custom hook to cycle through an array of messages at a given interval.
 * @param messages Array of messages to cycle through.
 * @param interval Duration (ms) each message is displayed.
 * @returns The current message and its index.
 */
function useCycleMessages(messages: string[], interval: number = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages, interval]);

  return { message: messages[index], index };
}

const LoadingIndicator: FC = () => {
  const { message, index } = useCycleMessages(loadingMessages);

  return (
    <div className="flex flex-col items-center justify-center pb-12">
      {/* Rotating spinner */}
      <svg
        className="h-10 w-10 animate-spin text-green-600"
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {/* Dynamic loading text with fade transition */}
      <p
        key={index}
        className="text-lg font-medium text-green-600 transition-opacity duration-500 ease-in-out"
      >
        {message}
      </p>
    </div>
  );
};

export default LoadingIndicator;

import { FormDataType } from "pages/MockPaperCreatorPage";
import { useEffect, useState } from "react";

interface Step2Props {
  formData: FormDataType;
  pdfUrl: string | null;
  onGenerate: () => void;
  loading: boolean;
  onNext: () => void;
}

const Step2Confirmation: React.FC<Step2Props> = ({
  formData,
  pdfUrl,
  onGenerate,
  loading,
  onNext,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const loadingMessages = [
    "Crafting your perfect mock paper...",
    "Almost done...",
    "Just a moment...",
    "We're getting things ready...",
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, loadingMessages.length]);

  const generateFileName = () => {
    const cleanString = (str: string) =>
      str.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    return `MockPaper_${cleanString(formData.board)}_${cleanString(
      formData.classLevel,
    )}_${cleanString(formData.selectedSubjects)}_${cleanString(
      formData.chapter,
    )}.pdf`;
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = generateFileName();
      link.click();
    }
  };

  return (
    <div className="px-4 md:px-8 pb-10 min-h-auto flex flex-col items-center justify-center">
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-green-600/90 py-4 ${pdfUrl ? "mb-8" : "mb-0"}`}
      >
        {pdfUrl && "Your Mock Paper is Ready!"}
      </h2>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center bg-white">
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
          <div
            className="mt-6 text-lg text-green-500 text-center font-semibold"
            aria-live="polite"
          >
            <p className="animate-pulse mt-2">
              {loadingMessages[messageIndex]}
            </p>
            <p className="text-sm mt-2 text-gray-600">
              This usually takes 15-20 seconds
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          {!pdfUrl && (
            <div className="w-full p-0 md:p-6">
              <h3 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-6">
                Your Selection Summary
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700">Education Board:</p>
                  <p className="text-gray-600 mt-1">{formData.board}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700">Class Level:</p>
                  <p className="text-gray-600 mt-1">{formData.classLevel}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700">Subjects:</p>
                  <p className="text-gray-600 mt-1">
                    {formData.selectedSubjects}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <p className="font-medium text-gray-700">Chapter:</p>
                  <p className="text-gray-600 mt-1">{formData.chapter}</p>
                </div>
              </div>
              {!pdfUrl && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={onGenerate}
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg"
                  >
                    {loading ? "Generating..." : "Generate Paper"}
                  </button>
                </div>
              )}
            </div>
          )}
          {pdfUrl && (
            <div className="w-full p-0 md:p-8">
              <h3 className="text-xl font-semibold text-gray-600 mb-6">
                Preview Your Paper
              </h3>
              <div className="relative h-[60vh] lg:h-[90vh] bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                <embed
                  src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
                <div className="absolute inset-0 border-4 border-green-500/20 pointer-events-none rounded-lg" />
              </div>
            </div>
          )}
        </div>
      )}

      {pdfUrl && (
        <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
          <button
            onClick={downloadPDF}
            className="w-full md:w-auto px-8 py-3 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
          <button
            onClick={() => window.location.replace("/mock-paper-creator")}
            className="w-full md:w-auto px-8 py-3 bg-white text-green-600 border border-green-600 rounded-lg shadow-md hover:bg-green-50"
          >
            Generate Another Paper
          </button>
          <button
            onClick={onNext}
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Step2Confirmation;

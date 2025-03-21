import React from "react";

interface AnswerKeyActionsProps {
  pdfUrl: string | null;
  onBack: () => void;
  answerKeyLoaded: boolean;
}

const AnswerKeyActions: React.FC<AnswerKeyActionsProps> = ({
  pdfUrl,
  onBack,
  answerKeyLoaded,
}) => (
  <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
    {!answerKeyLoaded && !pdfUrl && (
      <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
        Load Answer Key
      </button>
    )}
    {pdfUrl && (
      <>
        <a
          href={pdfUrl}
          download="answer-key.pdf"
          className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors text-center"
        >
          Download PDF
        </a>
        <button
          onClick={onBack}
          className="w-full md:w-auto px-8 py-3 bg-white text-green-600 border border-green-600 rounded-lg shadow-md hover:bg-green-50 transition-colors"
        >
          Regenerate Document
        </button>
      </>
    )}
  </div>
);

export default AnswerKeyActions;

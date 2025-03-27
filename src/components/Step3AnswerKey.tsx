/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormDataType } from "pages/MockPaperCreatorPage";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getAnswerKey } from "../services/api/getAnswerKey";
import AnswerKeyActions from "./AnswerKeyActions";
import LoadingSpinner from "./LoadingSpinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StepAnswer3KeyProps {
  formData: FormDataType;
  onBack: () => void;
  content: string;
  id: string;
}

const StepAnswer3Key: React.FC<StepAnswer3KeyProps> = ({
  formData,
  onBack,
  content,
  id,
}) => {
  const [answerKey, setAnswerKey] = useState("");
  const [loading, setLoading] = useState(false);
  // Remove pdfUrl if you're no longer using a PDF viewer
  const apiCalled = useRef(false); // Prevent multiple API calls

  useEffect(() => {
    if (apiCalled.current) return;
    apiCalled.current = true;

    const fetchAnswerKey = async () => {
      try {
        setLoading(true);
        const answerKeyContent = await getAnswerKey({
          id,
          board: formData.board,
          classLevel: formData.classLevel,
          selectedSubjects: formData.selectedSubjects,
          chapter: formData.chapter,
          paperType: formData.paperType,
          hit_count: 0,
          is_logedIn: true,
          question_paper: content,
        });

        setAnswerKey(answerKeyContent);
        toast.success("Answer key loaded successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to load answer key");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">
        Answer Key
      </h2>

      <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
        {loading ? (
          <LoadingSpinner message="Generating answer key..." />
        ) : answerKey ? (
          <div
            id="answerKeyContent"
            className="max-w-3xl mx-4 sm:mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-[600px] prose"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="text-4xl font-bold my-4" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="text-3xl font-bold my-4" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="text-2xl font-bold my-3" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="my-2 leading-relaxed" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="list-disc ml-6 my-1" {...props} />
                ),
                a: ({ ...props }) => (
                  <a className="text-blue-600 underline" {...props} />
                ),
              }}
            >
              {answerKey}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-green-700">No answer key available.</p>
        )}
      </div>

      <AnswerKeyActions
        pdfUrl={answerKey} // PDF download is optional; if you’re not using it, set to null.
        onBack={onBack}
        answerKeyLoaded={!!answerKey && !loading}
      />
    </div>
  );
};

export default StepAnswer3Key;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormDataType } from "pages/MockPaperCreatorPage";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { generateAnswerKeyPDF } from "utils/helper";
import { getAnswerKey } from "../services/api/getAnswerKey";
import AnswerKeyActions from "./AnswerKeyActions";
import LoadingSpinner from "./LoadingSpinner";
import PDFViewer from "./PDFViewer";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const apiCalled = useRef(false); // Prevent multiple API calls

  useEffect(() => {
    if (apiCalled.current) return; // Prevent multiple calls
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
        const generatedPdfUrl = generateAnswerKeyPDF(answerKeyContent);
        setPdfUrl(generatedPdfUrl);
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
        ) : pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} />
        ) : (
          <p className="text-green-700">
            No answer key loaded. Click the button below to load the answer key.
          </p>
        )}
      </div>

      <AnswerKeyActions
        pdfUrl={pdfUrl}
        onBack={onBack}
        answerKeyLoaded={!!answerKey && !loading}
      />
    </div>
  );
};

export default StepAnswer3Key;

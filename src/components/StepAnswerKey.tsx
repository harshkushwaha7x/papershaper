/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { getAnswerKey } from "../services/api/getAnswerKey";
import { FormDataType } from "pages/MockPaperCreatorPage";
import { Player } from "@lottiefiles/react-lottie-player";

interface StepAnswerKeyProps {
  formData: FormDataType;
  onBack: () => void;
  content: string;
  id: string;
}

const StepAnswerKey: React.FC<StepAnswerKeyProps> = ({
  formData,
  onBack,
  content,
  id,
}) => {
  const [answerKey, setAnswerKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const apiCalled = useRef(false); // Prevent multiple API calls

  const generateAnswerKeyPDF = (text: string) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Clean text: remove replacement characters and collapse extra spaces within each line
    text = text.replace(/\uFFFD/g, "");
    const lines = text.split("\n");

    lines.forEach((line) => {
      // Trim the line and collapse multiple spaces to one
      const cleanedLine = line.trim().replace(/\s{2,}/g, " ");
      if (cleanedLine === "") {
        yPos += 4; // Add extra spacing for blank lines
        return;
      }
      // if (/^Section\s+[ABC]/i.test(cleanedLine)) {
      //   doc.setFont("helvetica", "bold");
      //   doc.setFontSize(11);
      // } else if (/^\d+\./.test(cleanedLine)) {
      //   doc.setFont("helvetica", "bold");
      //   doc.setFontSize(10);
      // } else {
      //   doc.setFont("helvetica", "normal");
      //   doc.setFontSize(10);
      // }

      // Wrap text to ensure it doesn't get cut off
      const splitText = doc.splitTextToSize(cleanedLine, maxWidth);
      if (yPos + splitText.length * 6 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * 6 + 2;
    });

    const pdfBlob = doc.output("blob");
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  };

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
        generateAnswerKeyPDF(answerKeyContent);
        toast.success("Answer key loaded successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to load answer key");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerKey();
  }, []);

  return (
    <div className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">
        Answer Key
      </h2>

      <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Player
              autoplay
              loop
              src="../assets/lottie/loadingRobot.json"
              style={{ height: "200px", width: "200px" }}
            />
            <p className="text-green-700 mt-4">Generating answer key...</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl + "#toolbar=0"} // Hides the PDF viewer toolbar
            className="w-full h-[500px] border rounded-lg"
          ></iframe>
        ) : (
          <p className="text-green-700">
            No answer key loaded. Click the button below to load the answer key.
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
        {!answerKey && !loading && (
          <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors">
            Load Answer Key
          </button>
        )}
        {pdfUrl && (
          <a
            href={pdfUrl}
            download="answer-key.pdf"
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors text-center"
          >
            Download PDF
          </a>
        )}
        <button
          onClick={onBack}
          className="w-full md:w-auto px-8 py-3 bg-white text-green-600 border border-green-600 rounded-lg shadow-md hover:bg-green-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default StepAnswerKey;

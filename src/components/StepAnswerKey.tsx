/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { getAnswerKey } from "../services/api/getAnswerKey";
import { FormDataType } from "pages/MockPaperCreatorPage";

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
    const doc: any = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // Define font sizes and spacing
    const contentFontSize = 12; // Increased font size for answer text
    const headerFontSize = 16;
    const lineHeight = 8;
    const lineSpacing = 2;

    // Helper: Render a header with larger, bold text.
    const renderHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(headerFontSize);
      const headerText = "Answer Key";
      // Center the header on the page
      doc.text(headerText, pageWidth / 2, margin, { align: "center" });
      // Adjust yPos below the header
      yPos = margin + 12;
      // Reset font settings for content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(contentFontSize);
    };

    // Render header on the first page
    renderHeader();

    // Helper: Parse a line into segments with a "bold" flag based on ** markers.
    const parseInlineSegments = (line: string) => {
      const segments: { text: string; bold: boolean }[] = [];
      const regex = /\*\*(.*?)\*\*/g;
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          segments.push({
            text: line.substring(lastIndex, match.index),
            bold: false,
          });
        }
        segments.push({
          text: match[1],
          bold: true,
        });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        segments.push({ text: line.substring(lastIndex), bold: false });
      }
      return segments;
    };

    // Helper: Process a line with inline formatting and manual word wrapping.
    const processFormattedLine = (line: string) => {
      const segments = parseInlineSegments(line);
      // Break segments into individual word tokens (keeping spaces)
      const words: { text: string; bold: boolean }[] = [];
      segments.forEach((segment) => {
        const tokens = segment.text.split(/(\s+)/);
        tokens.forEach((token) => {
          if (token.length > 0) {
            words.push({ text: token, bold: segment.bold });
          }
        });
      });

      let currentLineWords: { text: string; bold: boolean }[] = [];
      let currentLineWidth = 0;

      words.forEach((word) => {
        // Set the font style and size for measurement
        doc.setFont("helvetica", word.bold ? "bold" : "normal");
        doc.setFontSize(contentFontSize);
        const wordWidth = doc.getTextWidth(word.text);
        // Add a space if needed (only if current line isn’t empty)
        const additionalWidth =
          currentLineWords.length > 0 ? doc.getTextWidth(" ") : 0;
        if (currentLineWidth + additionalWidth + wordWidth > maxWidth) {
          // Render current line
          let xPos = margin;
          currentLineWords.forEach((w) => {
            doc.setFont("helvetica", w.bold ? "bold" : "normal");
            doc.setFontSize(contentFontSize);
            doc.text(w.text, xPos, yPos);
            xPos += doc.getTextWidth(w.text);
          });
          yPos += lineHeight + lineSpacing;
          if (yPos > pageHeight - margin) {
            doc.addPage();
            renderHeader();
          }
          currentLineWords = [];
          currentLineWidth = 0;
        }
        if (currentLineWords.length > 0) {
          currentLineWords.push({ text: " ", bold: false });
          currentLineWidth += doc.getTextWidth(" ");
        }
        currentLineWords.push(word);
        currentLineWidth += wordWidth;
      });
      // Render any remaining words on the current line.
      if (currentLineWords.length > 0) {
        let xPos = margin;
        currentLineWords.forEach((w) => {
          doc.setFont("helvetica", w.bold ? "bold" : "normal");
          doc.setFontSize(contentFontSize);
          doc.text(w.text, xPos, yPos);
          xPos += doc.getTextWidth(w.text);
        });
        yPos += lineHeight + lineSpacing;
        if (yPos > pageHeight - margin) {
          doc.addPage();
          renderHeader();
        }
      }
    };

    // Clean the input text.
    text = text.replace(/\uFFFD/g, "");
    const lines = text.split("\n");

    lines.forEach((line) => {
      const cleanedLine = line.trim().replace(/\s{2,}/g, " ");
      if (cleanedLine === "") {
        yPos += lineHeight / 1.5; // extra spacing for blank lines
        return;
      }

      if (cleanedLine.includes("**")) {
        processFormattedLine(cleanedLine);
      } else {
        const splitText = doc.splitTextToSize(cleanedLine, maxWidth);
        if (
          yPos + splitText.length * (lineHeight + lineSpacing) >
          pageHeight - margin
        ) {
          doc.addPage();
          renderHeader();
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(contentFontSize);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * (lineHeight + lineSpacing);
      }
    });

    // Add page footers with copyright and page numbers.
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const footerText = "© 2025 Papershapers all rights reserved";
      doc.text(footerText, margin, pageHeight - 10);
      const pageText = `Page ${i} of ${pageCount}`;
      doc.text(pageText, pageWidth - margin, pageHeight - 10, {
        align: "right",
        margin: 5,
      });
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 md:px-8 min-h-screen flex flex-col items-center justify-center bg-green-50">
      <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">
        Answer Key
      </h2>

      <div className="w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
        {loading ? (
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
    </div>
  );
};

export default StepAnswerKey;

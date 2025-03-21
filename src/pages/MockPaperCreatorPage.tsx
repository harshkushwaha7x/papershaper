import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { getValue } from "../services/api/getValue";
import StepIndicator from "../components/StepIndicator";
import { SparklesIcon } from "@heroicons/react/24/solid";
import Step2Confirmation from "../components/Step2Confirmation";
import Step1Details from "../components/Step1Details";
import Step3AnswerKey from "../components/Step3AnswerKey";
import { downloadPdf } from "utils/helper";

export interface FormDataType {
  reason?: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  board: string;
  classLevel: "Class 9th" | "Class 10th" | "Class 11th" | "Class 12th" | "";
  selectedSubjects: string;
  chapter: string;
  paperType: string;
  id?: string;
  phoneNumber?: string;
}

const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormDataType>({
    reason: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: "",
    board: "CBSE",
    classLevel: "",
    selectedSubjects: "",
    chapter: "",
    paperType: "",
  });
  // Instead of pdfUrl we store the generated markdown content
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string>("");
  const [answerKeyId, setAnswerKeyId] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setFormData({
      reason: "",
      firstName: "",
      lastName: "",
      gender: "",
      email: "",
      phone: "",
      board: "CBSE",
      classLevel: "",
      selectedSubjects: "",
      chapter: "",
      paperType: "",
      id: "",
    });
    setStep(1);
    setMarkdownContent("");
    setLoading(false);
    setQuestions("");
    setAnswerKeyId("");
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      // Generate a random ID for the answer key
      const randomId = Math.random().toString(36).substr(2, 9);
      setAnswerKeyId(randomId);
      const payload = {
        id: randomId,
        board: formData.board,
        classLevel: formData.classLevel,
        selectedSubjects: formData.selectedSubjects,
        chapter: formData.chapter,
        paperType: formData.paperType,
        hit_count: 0,
        is_logedIn: "True",
      };

      const res = await getValue(payload);
      setLoading(false);

      const content = res.result ?? "";
      setQuestions(content);
      // Set the generated content as markdown to be rendered
      setMarkdownContent(content);
      toast.success("Mock paper generated successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error generating mock paper:", error);
      toast.error("Failed to generate mock paper. Please try again.");
    }
  };

  // Download the markdown content as a PDF using the helper function
  const downloadMarkdown = () => {
    if (!markdownContent) return;
    const cleanString = (str: string) =>
      str.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const fileName = `MockPaper_${cleanString(formData.board)}_${cleanString(
      formData.classLevel
    )}_${cleanString(formData.selectedSubjects)}_${cleanString(formData.chapter)}.pdf`;

    // Pass the element ID ("markdownContent") rather than markdownContent itself
    downloadPdf("markdownContent", fileName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center py-10 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-3xl w-full text-center mb-12 px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-green-100/80 rounded-full mb-6 sm:mb-8">
            <SparklesIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold text-gray-900 mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-700 leading-tight sm:leading-snug">
            AI-Powered Mock Paper Generator
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-green-800/90 font-medium max-w-prose mx-auto leading-relaxed sm:leading-normal">
            Create customized exam papers tailored to your specific needs.
            Select your class, subject, and chapter to generate practice
            materials instantly.
          </p>
        </div>

        <StepIndicator currentStep={step} />
        <div className="max-w-3xl w-full p-4 bg-white rounded-2xl shadow-lg">
          {step === 1 && (
            <Step1Details
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2Confirmation
              formData={formData}
              onGenerate={handleGenerate}
              markdownContent={markdownContent}
              loading={loading}
              onNext={handleNext}
              onDownload={downloadMarkdown}
            />
          )}
          {step === 3 && (
            <Step3AnswerKey
              formData={formData}
              content={questions}
              onBack={handleBack}
              id={answerKeyId}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MultiStepForm;

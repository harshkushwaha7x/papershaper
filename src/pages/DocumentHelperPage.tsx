import { useState, useRef, useEffect } from "react";
import {
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  DocumentTextIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import Header from "components/Header";
import Footer from "components/Footer";
import { toast } from "react-toastify";

const DocumentHelper = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files?.[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported file format. Please upload PDF or image files.");
      return;
    }

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size too large. Maximum 10MB allowed.");
      return;
    }

    setUploadedFile(file);
    setPdfUrl(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPdfUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setPdfUrl(null);

    try {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          setProgress((prev) => (prev >= 95 ? prev : prev + 5));
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          setPdfUrl("/dummy.pdf");
          toast.success("Document processed successfully!");
          resolve(true);
        }, 4000);
      });
    } catch (err) {
      toast.error("Failed to process document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins bg-clip-text bg-gradient-to-r from-green-700 to-emerald-700">
              Smart Document Analyzer
            </h1>
            <p className="text-lg text-green-800 font-medium">
              Transform documents into actionable interview questions & practice
              tests
            </p>
          </div>

          <div className="space-y-8 my-16">
            {/* File Upload Area */}
            <div
              className={`group relative border-3 border-dashed rounded-2xl p-8 py-16 transition-all bg-green-200/50 duration-300
                                ${
                                  isDragging
                                    ? "border-emerald-600 bg-green-100 scale-[1.02] shadow-lg"
                                    : "border-green-200 hover:border-emerald-500 bg-green-50"
                                }
                                transform-gpu will-change-transform`}
              onClick={() => !uploadedFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileSelect(e.target.files[0])
                }
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                {uploadedFile ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-emerald-100 p-4 rounded-full text-emerald-700 relative">
                      <ArrowUpTrayIcon className="w-8 h-8" />
                      <button
                        onClick={handleRemoveFile}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-medium text-green-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-all">
                      <ArrowUpTrayIcon className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-medium text-green-700 group-hover:text-green-900 transition-colors">
                        Click or drag to upload
                      </p>
                      <p className="text-sm text-green-600">
                        Supports: PDF, PNG, JPG, GIF • Max 10MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            {uploadedFile && !pdfUrl && (
              <div className="space-y-6">
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-xl 
                                        font-semibold hover:from-green-800 hover:to-emerald-800 disabled:opacity-80 transition-all
                                        flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-100/50
                                        transform-gpu hover:scale-[1.02] active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing... {progress}%</span>
                    </>
                  ) : (
                    <>
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>Generate Questions</span>
                    </>
                  )}
                </button>

                {/* Progress Bar */}
                {isLoading && (
                  <div className="relative h-2.5 bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 opacity-30 animate-pulse bg-gradient-to-r from-white/30 to-transparent w-[50%]" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Section */}
            {pdfUrl && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-2xl shadow-xl overflow-hidden border border-green-200">
                  <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 flex items-center gap-2">
                      <DocumentArrowDownIcon className="w-5 h-5 text-emerald-700" />
                      Your Questions Are Ready!
                    </h3>
                  </div>

                  <div className="relative group group-hover:shadow-lg transition-shadow">
                    <div className="absolute inset-0 bg-black/50 opacity-0 flex items-center justify-center backdrop-blur-sm">
                      <a
                        href={pdfUrl}
                        download="interview-questions.pdf"
                        className="bg-white text-emerald-700 px-6 py-3 rounded-lg flex items-center space-x-2
                                                    hover:bg-emerald-50 transition-colors shadow-lg transform-gpu hover:scale-105"
                      >
                        <DocumentArrowDownIcon className="w-5 h-5" />
                        <span className="font-semibold">Download PDF</span>
                      </a>
                    </div>
                    <iframe
                      src={pdfUrl}
                      className="w-full h-96 border-0 bg-white"
                      title="Generated PDF Preview"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRemoveFile}
                  className="text-emerald-700 hover:text-emerald-800 flex items-center space-x-2 mx-auto
                                        font-medium hover:underline underline-offset-4"
                >
                  <ArrowUpOnSquareIcon className="w-5 h-5" />
                  <span>Upload New Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DocumentHelper;

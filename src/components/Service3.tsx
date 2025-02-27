import { ArrowUpIcon, GlobeAltIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getResearchAnswer } from "services/api/getResearchAnswer";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import { generateAnswerKeyPDF } from "utils/helper";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";

const ResearchServicePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [researchResponse, setResearchResponse] = useState("");
  // const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Track active states for the Plus and Globe buttons
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [isGlobeActive, setIsGlobeActive] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await getResearchAnswer(query);
      // console.log("API response:", data);
      // const data = data2;
      const parsedResponse = JSON.parse(data.body);
      const responseText = parsedResponse.response;
      setResearchResponse(responseText);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF by capturing the markdown output
  const downloadPdf = async () => {
    const input = document.getElementById("markdownContent");
    if (input) {
      try {
        // Capture the element as a canvas
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("research-response.pdf");
        toast.success("PDF saved successfully.");
        // Optionally, set the pdfUrl state if needed:
        // setPdfUrl(`/research-response.pdf`);
      } catch (err) {
        console.error("Error generating PDF:", err);
      }
    } else {
      console.error("Element with id 'markdownContent' not found.");
    }
  };

  const togglePlus = () => {
    setIsPlusActive(!isPlusActive);
    setIsGlobeActive(false);
  };

  const toggleGlobe = () => {
    setIsGlobeActive(!isGlobeActive);
    setIsPlusActive(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-3xl text-green-600 sm:text-4xl font-semibold my-16 text-center">
          What do you need assistance with?
        </h1>

        <div className="w-full max-w-xl">
          {/* Input container with relative positioning */}
          <div className="relative">
            <div className="relative group">
              <input
                id="query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-36 border border-green-500 rounded-xl px-5 pt-3 pb-12 focus:outline-none focus:ring-2 focus:ring-green-500 text-base sm:text-lg"
              />
              <label
                htmlFor="query"
                className={`absolute left-5 transition-all pointer-events-none text-gray-400 ${
                  query
                    ? "text-sm top-3"
                    : "top-2 group-focus-within:text-xs group-focus-within:top-1"
                }`}
              >
                Enter your research query
              </label>
            </div>

            {/* Buttons container */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={togglePlus}
                  className={`p-2 rounded-full border-2 transition-colors ${
                    isPlusActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                  }`}
                  title="Toggle Plus Feature"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={toggleGlobe}
                  className={`flex items-center space-x-1 p-2 rounded-full border-2 transition-colors ${
                    isGlobeActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                  }`}
                  title="Toggle Globe Feature"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>

              <button
                onClick={handleSearch}
                disabled={!query || loading}
                className={`p-2 rounded-full bg-green-600 text-white transition-colors ${
                  (!query || loading) && "opacity-50 cursor-not-allowed"
                }`}
                title="Search"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {loading && <p className="text-center">Loading research response...</p>}

      {researchResponse && (
        <div
          id="markdownContent"
          className="max-w-3xl mx-auto my-8 p-4 border border-gray-200 rounded text-sm max-h-[600px] overflow-y-auto"
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
                <li className={`list-disc ml-6 my-1`} {...props} />
              ),
              a: ({ ...props }) => (
                <a className="text-blue-600 underline" {...props} />
              ),
            }}
          >
            {researchResponse}
          </ReactMarkdown>
        </div>
      )}

      {researchResponse && (
        <div className="text-center my-4">
          <button
            onClick={downloadPdf}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Download PDF
          </button>
          <button
            onClick={() => {
              setResearchResponse("");
              setQuery("");
            }}
            className="px-4 py-2 ml-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
          >
            Try Another Query
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ResearchServicePage;

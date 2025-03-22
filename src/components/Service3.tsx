import { ArrowUpIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";
import { getResearchAnswer } from "services/api/getResearchAnswer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingIndicator from "./LoadingIndicator";
import { Helmet } from "react-helmet-async";

const ResearchServicePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [researchResponse, setResearchResponse] = useState("");

  // Track active states for the Plus and Globe buttons
  const [isGlobeActive, setIsGlobeActive] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await getResearchAnswer(query);
      // Since getResearchAnswer already returns the parsed JSON,
      // we can directly extract the "response" property.
      setResearchResponse(data.response);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Download PDF by capturing the markdown output
  const downloadPdf = async () => {
    const input = document.getElementById("markdownContent");
    if (!input) {
      console.error("Element with id 'markdownContent' not found.");
      toast.error("PDF download error: Element not found");
      return;
    }
    try {
      // Capture the full content as a canvas
      const canvas = await html2canvas(input, {
        scale: 2,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("markdownContent");
          if (clonedElement) {
            clonedElement.style.overflow = "visible";
            clonedElement.style.maxHeight = "none";
          }
        },
      });

      // Initialize jsPDF for A4 dimensions (points)
      const pdf = new jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Define header and footer sizes (in points)
      const headerHeight = 50;
      const footerHeight = 30;
      const usablePageHeight = pdfHeight - headerHeight - footerHeight;

      // Calculate scaling factor from canvas pixels to PDF points
      const scaleFactor = pdfWidth / canvas.width;
      // Determine the height (in canvas pixels) of one page slice
      const pageSliceHeight = usablePageHeight / scaleFactor;
      // Calculate total number of pages required
      const totalPages = Math.ceil(canvas.height / pageSliceHeight);

      for (let page = 0; page < totalPages; page++) {
        // Create an offscreen canvas for this page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        // Ensure we don't exceed the remaining canvas height on the last page
        pageCanvas.height = Math.min(
          pageSliceHeight,
          canvas.height - page * pageSliceHeight
        );
        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          // Extract the slice of the canvas for this page
          ctx.drawImage(
            canvas,
            0,
            page * pageSliceHeight,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
          // Convert the page slice to an image
          const pageData = pageCanvas.toDataURL("image/png");
          // Add a new page for pages after the first one
          if (page > 0) {
            pdf.addPage();
          }

          // --- Draw Header ---
          // Draw a filled rectangle as the header background
          pdf.setFillColor(34, 197, 94); // Tailwind green-500
          pdf.rect(0, 0, pdfWidth, headerHeight, "F");

          // Set header text styles: bold, white
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(18);
          pdf.setTextColor(255, 255, 255);
          // Center the header text vertically and horizontally within the header area
          pdf.text("Research Report", pdfWidth / 2, headerHeight / 2 + 6, {
            align: "center",
          });

          // --- Draw Content ---
          // Reset text color for content if needed
          pdf.setTextColor(0, 0, 0);
          pdf.addImage(
            pageData,
            "PNG",
            0,
            headerHeight,
            pdfWidth,
            pageCanvas.height * scaleFactor
          );

          // --- Draw Footer ---
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const pageNumber = page + 1;
          pdf.text(
            `© 2025 Papershapers. All rights reserved. | Page ${pageNumber} of ${totalPages}`,
            pdfWidth / 2,
            pdfHeight - 10,
            { align: "center" }
          );
        }
      }

      // Use a semantic name for the PDF file
      const semanticName = "research-report.pdf";
      pdf.save(semanticName);
      toast.success("PDF saved successfully.");
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF");
    }
  };

  const toggleGlobe = () => {
    setIsGlobeActive(!isGlobeActive);
  };

  useEffect(() => {
    if (researchResponse) {
      console.log("Updated Markdown:", researchResponse);
    }
  }, [researchResponse]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Research Service - Papershapers</title>
        <meta
          name="description"
          content="Get your personalized research report from Papershapers. Ask your questions and receive detailed research answers in a beautifully formatted PDF."
        />
        <meta
          name="keywords"
          content="Research, Papershapers, Research Service, personalized research report, research query"
        />
        <meta name="robots" content="index, follow" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Research Service - Papershapers" />
        <meta
          property="og:description"
          content="Get your personalized research report from Papershapers."
        />
        <meta
          property="og:image"
          content="https://www.papershapers.com/og-image.jpg"
        />
        <meta
          property="og:url"
          content="https://www.papershapers.com/research"
        />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Research Service - Papershapers" />
        <meta
          name="twitter:description"
          content="Get your personalized research report from Papershapers."
        />
        <meta
          name="twitter:image"
          content="https://www.papershapers.com/og-image.jpg"
        />
      </Helmet>

      <Header />

      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center py-20 px-4">
          <h1 className="text-4xl text-green-700 font-bold mb-12 text-center">
            What do you need assistance with?
          </h1>

          <div className="w-full max-w-2xl">
            <div className="relative">
              <div className="relative group">
                <input
                  id="query"
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-40 border border-green-400 rounded-xl px-6 pt-5 pb-12 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-lg"
                />
                <label
                  htmlFor="query"
                  className={`absolute left-6 transition-all duration-200 ease-in-out pointer-events-none text-gray-500 ${
                    query
                      ? "text-sm top-4"
                      : "top-3 group-focus-within:text-xs group-focus-within:top-1"
                  }`}
                >
                  Enter your research query
                </label>
              </div>

              {/* Buttons container */}
              <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-5">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={toggleGlobe}
                    className={`flex items-center space-x-1 p-2 rounded-full border-2 transition transform hover:scale-105 ${
                      isGlobeActive
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                    }`}
                    title="Toggle Globe Feature"
                  >
                    <GlobeAltIcon className="w-6 h-6" />
                    <span className="hidden sm:inline-block font-medium">
                      Search
                    </span>
                  </button>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!query || loading}
                  className={`p-3 rounded-full bg-green-600 text-white transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    (!query || loading) && "opacity-50 cursor-not-allowed"
                  }`}
                  title="Search"
                >
                  <ArrowUpIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {loading && <LoadingIndicator />}

        {researchResponse && (
          <div
            id="markdownContent"
            className="max-w-3xl mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-[600px] prose"
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
              {researchResponse}
            </ReactMarkdown>
          </div>
        )}

        {researchResponse && (
          <div className="text-center my-6 space-x-4">
            <button
              onClick={downloadPdf}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Download PDF
            </button>
            <button
              onClick={() => {
                setResearchResponse("");
                setQuery("");
              }}
              className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Try Another Query
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResearchServicePage;

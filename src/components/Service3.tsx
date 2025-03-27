import { ArrowUpIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getResearchAnswer } from "services/api/getResearchAnswer";
import { downloadPdf } from "utils/helper";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingIndicator from "./LoadingIndicator";

const ResearchServicePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [researchResponse, setResearchResponse] = useState("");

  // Track active states for the Plus and Globe buttons
  const [isGlobeActive, setIsGlobeActive] = useState(false);

  const handleSearch = async () =>
  {
    setError(false);
    // Reset the response when a new query is made
    if (!query) return;
    setLoading(true);
    try {
      const data = await getResearchAnswer(query);
      // Since getResearchAnswer already returns the parsed JSON,
      // we can directly extract the "response" property.
      setResearchResponse(data.response);
    } catch (error) {
      setError(true);
      setResearchResponse("");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
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

          <div className="w-full max-w-2xl space-y-4">
            {/* Textarea Container */}
            <div className="relative">
              <textarea
                id="query"
                placeholder="Ask anything"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  // Reset the height so that we can correctly read the scrollHeight
                  e.target.style.height = "auto";
                  // Define maximum height (for example, 4 lines)
                  const maxHeight = 96; // adjust this value based on your line-height (e.g. 4 lines)
                  // Set the new height to the lesser of the scrollHeight or maxHeight
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, maxHeight) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSearch();
                  }
                }}
                className="w-full border border-green-400 rounded-xl px-6 pt-5 pb-3 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-lg resize-none"
                style={{ minHeight: "40px", maxHeight: "96px" }}
              />
            </div>

            {/* Buttons Container */}
            <div className="flex items-center justify-between px-5">
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
        </section>

        {loading && <LoadingIndicator />}

        {researchResponse && (
          <div
            id="markdownContent"
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
              {researchResponse}
            </ReactMarkdown>
          </div>
        )}

        {researchResponse && (
          <div className="text-center my-6 space-x-4">
            <button
              onClick={() =>
                downloadPdf("markdownContent", "research-report.pdf")
              }
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

        {error && (
          <div className="mx-auto max-w-md p-6 flex flex-col items-center space-y-4">
            <p className="text-center text-lg font-semibold text-red-700">
              Some error occurred while generating the report. Please try again.
            </p>
            <button
              onClick={ () =>
              {
                setError(false);
                setResearchResponse("");
                // setQuery("");
                handleSearch();
              }}
              className="w-fit px-8 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Retry
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ResearchServicePage;

import { useState } from "react";
import { ArrowUpIcon, GlobeAltIcon, PlusIcon } from "@heroicons/react/24/solid";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ResearchServicePage = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Track active states for the Plus and Globe buttons
  const [isPlusActive, setIsPlusActive] = useState(false);
  const [isGlobeActive, setIsGlobeActive] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    // Handle the response (e.g., display the text output on screen)
    console.log("Searching for:", query);
  };

  const togglePlus = () => {
    setIsPlusActive(!isPlusActive);
    // Optionally deactivate the globe if you want only one active at a time
    setIsGlobeActive(false);
  };

  const toggleGlobe = () => {
    setIsGlobeActive(!isGlobeActive);
    // Optionally deactivate the plus if you want only one active at a time
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
          {/* Container with relative positioning for input & buttons */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research query"
              className="w-full h-24 border border-green-500 rounded-xl px-5 pt-6 pb-2
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         text-base sm:text-lg"
            />

            {/* Absolute-positioned row of buttons at the bottom of the input */}
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-4">
              {/* Left side: Plus and Globe buttons */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={togglePlus}
                  className={`p-2 rounded-full border-2 transition-colors
                    ${
                      isPlusActive
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                    }
                  `}
                  title="Toggle Plus Feature"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={toggleGlobe}
                  className={`flex items-center space-x-1 p-2 rounded-full border-2 transition-colors
                    ${
                      isGlobeActive
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-green-600 border-green-600 hover:bg-green-50"
                    }
                  `}
                  title="Toggle Globe Feature"
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Right side: Search (Arrow) button */}
              <button
                onClick={handleSearch}
                disabled={!query || loading}
                className={`p-2 rounded-full bg-green-600 text-white transition-colors
                  ${(!query || loading) && "opacity-50 cursor-not-allowed"}
                `}
                title="Search"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchServicePage;

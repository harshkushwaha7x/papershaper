// src/pages/LandingPage.tsx
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Link } from "react-router";
import {
  CloudArrowUpIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import FAQSection from "components/FAQSection";

const LandingPage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-12 md:py-24 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-gray-900">
            Transform Your Exam Preparation and Research Workflow with
          </h1>

          {/* Animated Heading */}
          <h2 className="inline-block overflow-hidden border-r-4 border-green-700 text-xl motion-preset-typewriter-[50] motion-duration-[8s] sm:text-2xl md:text-4xl font-bold text-green-700 whitespace-nowrap mx-auto max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-6xl">
            GenAI-Powered Exam Papers for Classes 9-12 | CBSE
          </h2>

          <p className="text-md sm:text-lg md:text-xl text-gray-600 mt-6 sm:mt-8 md:mt-8 mb-8 md:mb-12">
            Elevate Your Study Game with Expert Tools: Create AI-Powered Mock
            Papers and generate comprehensive research outputs from curated web
            sources with ease.
          </p>

          {/* Buttons Container */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm sm:text-base"
            >
              Start Free Trial
            </Link>
            <Link
              to="/mock-paper-creator"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-gray-200 text-gray-600 font-semibold rounded-full text-sm sm:text-base"
            >
              Exam Generator
            </Link>
            <Link
              to="/research-service"
              className="px-6 py-3 sm:px-8 sm:py-4 bg-green-100 text-green-700 font-semibold rounded-full text-sm sm:text-base"
            >
              Research Text Output
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-700">
            Smart Exam Preparation & Research Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                title: "AI-Powered Exam Generator",
                description:
                  "Create customized mock papers and test questions for Classes 9-12 (CBSE). Select your class, subject, and chapter to generate tailored practice materials or assessment questions instantly.",
                link: "/mock-paper-creator",
                linkText: "Try Exam Generator",
                icon: <SparklesIcon className="w-10 h-10 text-green-600" />,
              },
              {
                title: "Document-Based Question Generator",
                description:
                  "Upload documents (resumes, study materials, etc.) to receive personalized text outputs with relevant interview questions or chapter tests generated using content analysis and web research integration.",
                link: "/document-helper",
                linkText: "Try Document Helper",
                icon: <CloudArrowUpIcon className="w-10 h-10 text-green-600" />,
              },
              {
                title: "Web Research Questions Generator",
                description:
                  "Input your research query and get a detailed text output compiling curated web sources and research insights, empowering your study and analysis with up-to-date information.",
                link: "/research-service",
                linkText: "Try Research Text Generator",
                icon: (
                  <MagnifyingGlassIcon className="w-10 h-10 text-green-600" />
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg flex flex-col"
              >
                <div className="flex-grow">
                  <div className="mb-6 p-4 bg-emerald-50 rounded-full w-16 h-16 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <a
                  href={feature.link}
                  className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center font-semibold shadow-md hover:shadow-lg"
                >
                  {feature.linkText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Key Benefits of Using Papershapers
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Experience a revolution in exam preparation and research with our
            free, AI-powered platform—designed exclusively for educational
            excellence.
          </p>
          <ul className="space-y-6 text-left">
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-green-700 font-bold">
                •
              </span>
              <span>
                <strong>Cost-Free Innovation:</strong> Empower your studies
                without any cost, as our platform is completely free for
                students, teachers, and institutions.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-green-700 font-bold">
                •
              </span>
              <span>
                <strong>Personalized Exam Generation:</strong> Leverage AI to
                create custom mock papers tailored to your specific curriculum
                and learning needs.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-green-700 font-bold">
                •
              </span>
              <span>
                <strong>Real-Time Answer Key:</strong> Receive immediate solutions
                that helps you pinpoint strengths and address weaknesses
                effectively.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 mr-3 text-green-700 font-bold">
                •
              </span>
              <span>
                <strong>Integrated Research Support:</strong> Combine exam prep
                with research outputs and curated insights from credible web
                sources for a holistic learning experience.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Completely Free for Educational Use
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
            We believe in accessible education for all. Our platform is
            completely free for students, teachers, and educational
            institutions.
          </p>

          <div className="bg-green-50 rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border border-green-100">
            <div className="mb-6">
              <span className="bg-green-700 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                Free Forever
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Full Access for Everyone
            </h3>
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-green-700">
              $0
            </p>
            <ul className="text-gray-600 space-y-3 mb-8 text-sm sm:text-base max-w-sm mx-auto text-left">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Unlimited AI-generated papers
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                All question types and subjects
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Priority support for educators
              </li>
            </ul>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors duration-300 shadow-md text-base sm:text-lg"
            >
              Get Started Free
            </Link>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-gray-500">
            For schools and institutions needing customized solutions, contact
            our education team.
          </p>
        </div>
      </section>

      {/* FAQSection */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

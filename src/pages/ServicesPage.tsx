// src/pages/ServicesPage.tsx
import {
  CloudArrowUpIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Footer from "components/Footer";
import Header from "components/Header";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const services = [
    {
      icon: <SparklesIcon className="w-10 h-10 text-green-600" />,
      title: "AI-Powered Exam Preparation",
      description:
        "Generate customized mock papers and test questions based on your class (9th-12th), subject, and specific chapters. Select your board (CBSE), input your requirements, and get tailored practice materials instantly.",
      link: "/mock-paper-creator",
      linkText: "Try Exam Generator",
    },
    {
      icon: <CloudArrowUpIcon className="w-10 h-10 text-green-600" />,
      title: "Document-Based Question Generation",
      description:
        "Upload any document (resumes, study materials, etc.) and receive a comprehensive text output with relevant interview questions or practice tests generated using content analysis and web research integration.",
      link: "/document-helper",
      linkText: "Try Document Helper",
    },
    {
      icon: <MagnifyingGlassIcon className="w-10 h-10 text-green-600" />,
      title: "Web Research Test Generator",
      description:
        "Enter a research query to generate a detailed text output compiling curated web sources and research insights, empowering your study and analysis with up-to-date information.",
      link: "/research-service",
      linkText: "Try Research Test Generator",
    },
  ];

  return (
    <div>
      <Header />
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-700">
            Our Services
          </h2>
          <p className="text-lg text-green-800 text-center mb-12 max-w-2xl mx-auto font-medium">
            Empowering your academic and professional success with tailored
            solutions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl flex flex-col"
              >
                <div className="flex-grow">
                  <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <Link
                  to={service.link}
                  className="mt-4 inline-block px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-center font-semibold shadow-md hover:shadow-lg"
                >
                  {service.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;

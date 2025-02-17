// src/pages/AboutPage.tsx

import Header from "../components/Header";
import Footer from "../components/Footer";
// import ankitImage from '../assets/images/photo_ankit.png';
// import anjaliImage from '../assets/images/photo_anjali.jpeg';
import chetnaImage from "../assets/images/chetna_kumar.jpeg";
// import yashImage from '../assets/images/photo_yash.jpeg';
import harshImage from "../assets/images/photo_harsh.jpeg";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
const AboutPage = () => {
  return (
    <div className="font-sans text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-50">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900">
          Building the Future of Education
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-8 mb-12 max-w-2xl mx-auto">
          Meet the passionate team behind Paper Shaper's innovative learning
          solutions
        </p>
      </section>

      {/* Team Members Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
            Development Team & Contributors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
            {/* Harsh Kushwaha - CEO */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
              <img
                src={harshImage}
                alt="Harsh Kushwaha"
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-green-100"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Harsh Kushwaha
              </h3>
              <p className="text-sm text-green-600 font-medium mb-3 text-center">
                Project Lead & System Architect
              </p>
              <p className="text-sm text-gray-600 text-center">
                Orchestrated project lifecycle management, designed core system
                architecture, and led backend research initiatives for scalable
                educational solutions.
              </p>
              <div className="mt-4 flex justify-center">
                <a
                  href="http://www.linkedin.com/in/harsh-kushwaha-890709283"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Yash Kushwaha - AI/Backend */}
            {/* <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
                            <img
                                src={yashImage}
                                alt="Yash Kushwaha"
                                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-green-100"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                Yash Kushwaha
                            </h3>
                            <p className="text-sm text-green-600 font-medium mb-3 text-center">
                                AI Research Lead
                            </p>
                            <p className="text-sm text-gray-600 text-center">
                                Developed the core LLM architecture, engineered FastAPI services,
                                and optimized question generation algorithms for dynamic paper creation.
                            </p>
                            <div className="mt-4 flex justify-center">
                                <a
                                    href="https://www.linkedin.com/in/yash-kushwaha-543786187"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div> */}

            {/* Ankit Varshney - Frontend */}
            {/* <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
                            <img
                                src={ankitImage}
                                alt="Ankit Varshney"
                                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-green-100"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                Ankit Varshney
                            </h3>
                            <p className="text-sm text-green-600 font-medium mb-3 text-center">
                                Frontend Architect
                            </p>
                            <p className="text-sm text-gray-600 text-center">
                                Designed and implemented the React-based UI/UX, developed core application workflows,
                                and engineered API integration layers for seamless system interaction.
                            </p>
                            <div className="mt-4 flex justify-center">
                                <a
                                    href="https://www.linkedin.com/in/ankitvars"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div> */}

            {/* Chetna Kumar - Backend */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
              <img
                src={chetnaImage}
                alt="Chetna Kumar"
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-green-100"
              />
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                Chetna Kumar
              </h3>
              <p className="text-sm text-green-600 font-medium mb-3 text-center">
                Backend Engineer
              </p>
              <p className="text-sm text-gray-600 text-center">
                Enhanced API security layers, optimized database operations, and
                implemented automated testing frameworks for backend services.
              </p>
              <div className="mt-4 flex justify-center">
                <a
                  href="https://www.linkedin.com/in/chetna-kumar-a7417a24b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Anjali Maddheshiya - Frontend */}
            {/* <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
                            <img
                                src={anjaliImage}
                                alt="Anjali Maddheshiya"
                                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-green-100"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                Anjali Maddheshiya
                            </h3>
                            <p className="text-sm text-green-600 font-medium mb-3 text-center">
                                UI Engineer
                            </p>
                            <p className="text-sm text-gray-600 text-center">
                                Developed reusable React components, implemented responsive layouts,
                                and enhanced user interaction patterns across application workflows.
                            </p>
                            <div className="mt-4 flex justify-center">
                                <a
                                    href="https://www.linkedin.com/in/anjali-maddeshiya-986248183"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div> */}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

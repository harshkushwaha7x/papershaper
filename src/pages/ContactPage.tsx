// src/pages/ContactPage.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useForm, ValidationError } from "@formspree/react";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/solid";

const ContactPage = () => {
  const [state, handleSubmit] = useForm("mnnjqekj"); // Replace with your Formspree form ID

  return (
    <div className="font-sans text-gray-800">
      <Header />

      {/* Hero Section */}
      <section className="text-center py-10 bg-gray-50">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 text-gray-900">
          Get in Touch with Paper Shapers
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-8 mb-12 max-w-2xl mx-auto">
          Have questions or need help? Our team is here to assist you.
        </p>
      </section>

      {/* Contact Form */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Send Us a Message
          </h2>

          {state.succeeded ? (
            <div className="p-6 bg-green-50 rounded-lg">
              <p className="text-green-700 text-xl font-semibold">
                Message sent successfully! We'll respond shortly.
              </p>
            </div>
          ) : (
            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-4 bg-gray-100 border border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <ValidationError
                  prefix="Name"
                  field="name"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-4 bg-gray-100 border border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <ValidationError
                  prefix="Email"
                  field="email"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  className="w-full p-4 bg-gray-100 border border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 h-32"
                />
                <ValidationError
                  prefix="Message"
                  field="message"
                  errors={state.errors}
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={state.submitting}
                className="w-fit px-6 py-3 bg-green-700 text-white rounded-full hover:bg-green-800 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact Information (remains unchanged) */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Contact Information
          </h2>
          <ul className="space-y-6">
            <li className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-4">
                <EnvelopeIcon className="w-5 h-5 text-green-700" />
              </span>
              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <a
                  href="mailto:papershaper07x@gmail.com"
                  className="text-green-700 hover:text-green-800 ml-2"
                >
                  papershaper07x@gmail.com
                </a>
              </div>
            </li>
            <li className="hidden items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-4">
                <PhoneIcon className="w-5 h-5 text-green-700" />
              </span>
              {/* <div>
                                <span className="font-semibold text-gray-700">Phone:</span>
                                <span className="text-gray-600 ml-2">+91 8528815252</span>
                            </div> */}
            </li>
            <li className="flex items-start bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="flex-shrink-0 w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-4">
                <MapPinIcon className="w-5 h-5 text-green-700" />
              </span>
              <div>
                <span className="font-semibold text-gray-700">Address:</span>
                <span className="text-gray-600 ml-2">
                  Paper Shapers, New Delhi, India
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;

import { useState, FC } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: FC = () => {
  const faqData: FAQItem[] = [
    {
      question: "Is Papershapers completely free for educational use?",
      answer:
        "Yes, Papershapers is entirely free for students, teachers, and educational institutions. We believe in accessible education and offer full access with no hidden costs.",
    },
    {
      question: "Which classes does Papershapers cater to?",
      answer:
        "Papershapers is designed for exam preparation and research specifically for Classes 9-12, with a strong focus on the CBSE curriculum.",
    },
    {
      question: "How does the AI-powered exam generator work?",
      answer:
        "Our AI-powered exam generator creates customized mock papers by analyzing your selected subject, chapter, and difficulty level, ensuring a personalized practice experience.",
    },
    {
      question: "Can I use Papershapers for research purposes?",
      answer:
        "Absolutely! In addition to generating exam papers, Papershapers compiles curated research outputs from reliable web sources to help you with your studies.",
    },
    {
      question: "How is my data secured on Papershapers?",
      answer:
        "Your data is protected with state-of-the-art encryption and strict security protocols, ensuring that your information remains private and secure.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number): void => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="p-6 cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  {faq.question}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
                    expandedIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {expandedIndex === index && (
                <p className="mt-4 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

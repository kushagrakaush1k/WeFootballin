"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "How do I join a WeFootballin' game?",
    answer: "Register and book your spot through our website or WhatsApp.",
  },
  {
    question: "Do I need to be part of a fixed team to play?",
    answer: "No, you can join alone and we’ll place you in a team.",
  },
  {
    question: "Where is WeFootballin' currently active?",
    answer: "We are currently active in South Delhi.",
  },
  {
    question: "How can I stay updated on upcoming matches or tournaments?",
    answer: "Follow our social pages or join our WhatsApp broadcast.",
  },
  {
    question: "What skill level do I need to play?",
    answer: "All skill levels are welcome, from beginners to advanced.",
  },
];

export default function CTASection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white pt-14 py-10 px-2 min-h-screen w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-3 mt-0 tracking-tight">
          HAVE ANY QUESTIONS?
        </h1>
        <p className="text-xl text-center text-gray-700 mb-10 font-medium">
          Everything you need to know to join a game
        </p>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex justify-between items-center py-6 px-2 focus:outline-none transition-colors"
                onClick={() => toggleFAQ(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-lg sm:text-xl font-bold text-gray-900 text-left">
                  {faq.question}
                </span>
                <span
                  className="flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                  }}
                >
                  <span
                    className={`rounded-full flex items-center justify-center transition-all duration-200 ease-in-out shadow-sm`}
                    style={{
                      width: 56,
                      height: 56,
                      background: "rgba(16,185,129,0.13)",
                    }}
                  >
                    {openIndex === i ? (
                      // Green Close Icon SVG
                      <svg width="30" height="30" viewBox="0 0 30 30">
                        <line
                          x1="8"
                          y1="8"
                          x2="22"
                          y2="22"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></line>
                        <line
                          x1="22"
                          y1="8"
                          x2="8"
                          y2="22"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></line>
                      </svg>
                    ) : (
                      // Green Plus Icon SVG
                      <svg width="30" height="30" viewBox="0 0 30 30">
                        <line
                          x1="15"
                          y1="8"
                          x2="15"
                          y2="22"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></line>
                        <line
                          x1="8"
                          y1="15"
                          x2="22"
                          y2="15"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                        ></line>
                      </svg>
                    )}
                  </span>
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                className={`text-base sm:text-lg text-gray-700 px-2 pb-5 transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
                  openIndex === i
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
                aria-hidden={openIndex !== i}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .divide-y > :not([hidden]) ~ :not([hidden]) {
          border-top-width: 2px !important;
        }
      `}</style>
    </section>
  );
}

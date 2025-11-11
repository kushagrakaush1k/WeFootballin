"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "How do I join a WeFootballin' game?",
    answer:
      "You can join a game through our regular hosted pickup matches in GK 1 and GK 2. We announce games in advance — simply register your spot, show up, and play. If you're an individual player, we'll slot you into a balanced team. If you already have a group, you can register together. No team? No problem — we'll help you find one!",
  },
  {
    question: "Do I need to be part of a fixed team to play?",
    answer:
      "Not at all. WeFootballin' is designed for everyone — whether you play solo or as part of a crew. •	Solo players can join open pickup games.•	Groups or teams can register together and compete against others. Our system helps individuals and teams connect easily — ensuring that everyone gets to play, every time.",
  },
  {
    question: "Where is WeFootballin' currently active?",
    answer:
      "We're currently operational in Greater Kailash 1 (GK 1) and Greater Kailash 2 (GK 2), where we host regular games and mini-tournaments. We're also working on expanding to new areas soon — so stay tuned for updates on our next locations!",
  },
  {
    question: "How can I stay updated on upcoming matches or tournaments?",
    answer:
      "We post all match schedules, registration links, and updates through our official communication channels — including WhatsApp groups, Instagram, and our community announcements. You can also reach out directly to our coordinators in GK 1 or GK 2 to join the player list and get notified of upcoming games.",
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

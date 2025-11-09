"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface ScrollSectionProps {
  text?: string;
}

export default function ScrollSection({
  text = "Join the elite. Play the game. Win the glory.",
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words] = useState(() => text.split(" "));
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const wordProgress = useTransform(scrollYProgress, [0, 1], [0, words.length]);

  useEffect(() => {
    return wordProgress.on("change", (latest) => {
      setActiveWordIndex(Math.floor(latest));
    });
  }, [wordProgress]);

  return (
    <div ref={containerRef} className="relative" style={{ height: `130vh` }}>
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Content Container - Sticky */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-center">
            {words.map((word, idx) => {
              const isActive = idx < activeWordIndex;

              return (
                <motion.span
                  key={idx}
                  className="inline-block mr-3 md:mr-4 lg:mr-5 mb-2"
                  initial={{ opacity: 0.15, scale: 0.95 }}
                  animate={{
                    opacity: isActive ? 1 : 0.15,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  style={{
                    color: isActive ? "#10b981" : "#d4d4d8",
                    textShadow: isActive
                      ? "0 0 40px rgba(16, 185, 129, 0.3)"
                      : "none",
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </p>

          {/* Progress Bar */}
          <motion.div
            className="mt-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{
                  scaleX: useTransform(wordProgress, [0, words.length], [0, 1]),
                  transformOrigin: "left",
                }}
              />
            </div>

            <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
              <span>Start</span>
              <motion.span className="text-emerald-600">
                {Math.round(
                  (Math.max(0, activeWordIndex) / words.length) * 100
                )}
                %
              </motion.span>
              <span>Complete</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

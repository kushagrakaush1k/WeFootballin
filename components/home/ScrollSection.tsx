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

  // SUPER FAST - fills in first 30% of scroll
  const wordProgress = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0, words.length]
  );

  useEffect(() => {
    return wordProgress.on("change", (latest) => {
      const currentIndex = Math.min(Math.floor(latest), words.length);
      setActiveWordIndex(currentIndex);
    });
  }, [wordProgress, words.length]);

  const progressPercentage = Math.round(
    (Math.max(0, activeWordIndex) / words.length) * 100
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full py-0 my-0"
      style={{
        height: `${60 + words.length * 4}vh`,
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Content Container */}
      <div className="h-screen w-full flex items-center justify-center px-4 sm:px-6 relative py-0 my-0">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl w-full relative z-10">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-center py-0 my-0">
            {words.map((word, idx) => {
              const isActive = idx < activeWordIndex;

              return (
                <motion.span
                  key={idx}
                  className="inline-block mr-2 sm:mr-3 md:mr-4 mb-1 sm:mb-2"
                  initial={{ opacity: 0.15, scale: 0.95 }}
                  animate={{
                    opacity: isActive ? 1 : 0.15,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{
                    duration: 0.15,
                    ease: "easeOut",
                  }}
                  style={{
                    color: isActive ? "#10b981" : "#d4d4d8",
                    textShadow: isActive
                      ? "0 0 30px rgba(16, 185, 129, 0.25)"
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
            className="mt-6 max-w-sm mx-auto py-0 my-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <motion.div
                className={`h-full ${
                  progressPercentage === 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                }`}
                style={{
                  scaleX: useTransform(wordProgress, [0, words.length], [0, 1]),
                  transformOrigin: "left",
                }}
              />
            </div>

            <div className="flex justify-between mt-1.5 text-xs font-bold text-gray-500 gap-1">
              <span>Start</span>
              <motion.span
                className={
                  progressPercentage === 100
                    ? "text-emerald-600 font-bold"
                    : "text-emerald-600"
                }
              >
                {progressPercentage}%
              </motion.span>
              <span
                className={
                  progressPercentage === 100 ? "text-emerald-600 font-bold" : ""
                }
              >
                {progressPercentage === 100 ? "✓" : "Done"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

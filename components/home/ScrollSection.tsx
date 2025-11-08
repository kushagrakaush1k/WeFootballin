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
    offset: ["start end", "end start"],
  });

  const wordProgress = useTransform(
    scrollYProgress,
    [0.2, 0.8], // Start revealing at 20% scroll, finish at 80%
    [0, words.length]
  );

  useEffect(() => {
    return wordProgress.on("change", (latest) => {
      setActiveWordIndex(Math.floor(latest));
    });
  }, [wordProgress]);

  return (
    <div ref={containerRef} className="relative bg-black py-20 md:py-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

      {/* Content Container */}
      <div className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-8 lg:px-12">
        {/* Subtle Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.2] text-center">
            {words.map((word, idx) => {
              const isActive = idx <= activeWordIndex;

              return (
                <motion.span
                  key={idx}
                  className="inline-block mr-3 sm:mr-4 md:mr-5 lg:mr-6 mb-2 sm:mb-3"
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
                    color: isActive ? "#10b981" : "#52525b",
                    textShadow: isActive
                      ? "0 0 40px rgba(16, 185, 129, 0.4)"
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
            className="mt-12 sm:mt-16 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                style={{
                  scaleX: useTransform(wordProgress, [0, words.length], [0, 1]),
                  transformOrigin: "left",
                }}
              />
            </div>

            <div className="flex justify-between mt-3 text-xs font-bold text-zinc-600">
              <span>Start</span>
              <motion.span className="text-emerald-500">
                {Math.round(
                  (Math.max(0, activeWordIndex) / words.length) * 100
                )}
                %
              </motion.span>
              <span>Complete</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-2"
            initial={{ opacity: 1 }}
            animate={{
              opacity: activeWordIndex > 0 ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-bold text-zinc-600 tracking-wider uppercase">
              Scroll to reveal
            </p>
            <motion.div className="w-6 h-10 border-2 border-emerald-500/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-emerald-500 rounded-full"
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

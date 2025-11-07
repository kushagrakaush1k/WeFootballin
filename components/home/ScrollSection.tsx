"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface SmoothScrollSectionProps {
  text?: string;
  index?: number;
}

export default function ScrollSection({
  text = "Join thousands of players who are already part of the We Footballin' community. Find your next game, track your progress, and become the player you've always wanted to be.",
  index = 0,
}: SmoothScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [words] = useState(() => text.split(" "));
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const wordProgress = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [0, words.length]
  );

  useEffect(() => {
    return wordProgress.on("change", (latest) => {
      setActiveWordIndex(Math.floor(latest));
    });
  }, [wordProgress]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        height: `${100 + words.length * 15}vh`,
      }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] text-center">
            {words.map((word, idx) => {
              const isActive = idx <= activeWordIndex;

              return (
                <motion.span
                  key={idx}
                  className="inline-block mr-3 md:mr-4 lg:mr-5 transition-all duration-700 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0.15,
                    color: isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {word}
                </motion.span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

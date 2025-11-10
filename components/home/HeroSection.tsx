"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Zap, ChevronRight } from "lucide-react";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});

  useEffect(() => {
    const deadline = new Date("2025-11-15T23:59:59").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = deadline - now;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/images/wefootballin-cover.png)",
      }}
    >
     
    </div>
  );
};

export default HeroSection;

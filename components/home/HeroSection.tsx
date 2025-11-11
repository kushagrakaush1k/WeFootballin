"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Zap, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});

  // CHANGE THIS LINK TO YOUR GOOGLE DOC
  const TOURNAMENT_DETAILS_LINK =
    "https://drive.google.com/file/d/1xDOhSvLpaSbrZIwb_yJCoalV-6KB4nRT/view?usp=sharing";

  useEffect(() => {
    const deadline = new Date("2025-11-28T23:59:59").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url(/images/wefootballin-cover.png)",
      }}
    >
      {/* Elegant dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Tournament Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 rounded-full px-6 py-3 shadow-lg">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              ROCK8 LEAGUE 25'
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
          <span className="block text-white drop-shadow-2xl mb-2">
            The Ultimate Football Championship.
          </span>
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 mt-10">
          <Link href="/register-team">
            <button className="group relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-emerald-500/50 flex items-center gap-3 w-full sm:w-auto">
              <Zap className="w-5 h-5" />
              Register Your Team
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <a
            href={TOURNAMENT_DETAILS_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 border-2 border-white/40 flex items-center gap-2 w-full sm:w-auto">
              <FileText className="w-5 h-5" />
              View Tournament Details
            </button>
          </a>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <p className="text-emerald-400 font-bold text-lg mb-6 text-center uppercase tracking-wider flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Tournament Starts In
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-emerald-400/40 mb-2 shadow-lg">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tabular-nums">
                      {item.value?.toString().padStart(2, "0")}
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-semibold uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats - Clean and Minimal */}
        <div className="grid grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {[
            { value: "₹3L+", label: "Prize Pool", icon: "💰" },
            { value: "16", label: "Teams", icon: "🏆" },
            { value: "8v8", label: "Format", icon: "⚽" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80 font-semibold uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

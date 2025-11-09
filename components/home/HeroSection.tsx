"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Zap,
  Users,
  Calendar,
  Award,
  ChevronRight,
  Sparkles,
  Flame,
  Crown,
} from "lucide-react";

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface MousePos {
  x: number;
  y: number;
}

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });

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

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const FloatingBall = ({
    delay,
    duration,
  }: {
    delay: number;
    duration: number;
  }) => (
    <div
      className="absolute w-6 h-6 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 rounded-full opacity-20 animate-bounce blur-sm"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />

      {/* Animated Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(16,185,129,0.02)_50%)] bg-[length:100%_4px] animate-scan pointer-events-none" />

      {/* Floating Balls */}
      {[...Array(20)].map((_, i) => (
        <FloatingBall key={i} delay={i * 0.2} duration={2 + i * 0.2} />
      ))}

      {/* Massive Gradient Orbs with Parallax */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-transparent rounded-full blur-[120px] animate-pulse"
        style={{
          transform: `translate(${mousePos.x * 0.03}px, ${
            mousePos.y * 0.03
          }px)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tl from-emerald-400/15 via-green-600/10 to-transparent rounded-full blur-[140px] animate-pulse"
        style={{
          transform: `translate(${-mousePos.x * 0.03}px, ${
            -mousePos.y * 0.03
          }px)`,
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-[160px] animate-pulse"
        style={{
          animationDelay: "0.7s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-32">
        {/* Top Badge */}
        <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 border border-emerald-400/30 backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-emerald-600 tracking-wider">
              OFFICIAL COMMUNITY PARTNERS
            </span>
            <Crown className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-6xl mx-auto">
          {/* Brand Collaboration Title - LEGENDARY */}
          <div className="space-y-4 sm:space-y-6 relative">
            {/* Glow effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent blur-3xl" />

            <h1 className="relative text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] animate-pulse">
                ROCK8
              </span>
              <span className="inline-block mx-2 sm:mx-4 text-emerald-500 animate-pulse scale-110">
                ×
              </span>
              <span className="inline-block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] animate-pulse">
                WeFootballin'
              </span>
            </h1>

            {/* Animated divider */}
            <div className="flex justify-center items-center gap-2">
              <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-transparent via-emerald-500 to-emerald-400 animate-pulse" />
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 animate-bounce" />
              <div className="h-1 w-16 sm:w-24 bg-gradient-to-l from-transparent via-emerald-500 to-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Subtitle - EPIC */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(16,185,129,0.3)] animate-pulse px-4">
            LEAGUE 2025-26
          </h2>

          <p className="text-base sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
            Delhi's most{" "}
            <span className="text-emerald-600 font-black text-xl sm:text-2xl md:text-3xl drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              ELITE
            </span>{" "}
            football tournament!
            <br />
            <span className="text-lg sm:text-xl md:text-2xl">
              16 teams. ₹3 Lakh prize pool. One legendary champion.
            </span>
          </p>

          {/* Quick Stats - ENHANCED */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mt-8 sm:mt-12 px-4">
            {[
              {
                icon: Users,
                label: "16 Teams",
                value: "Elite Competition",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Trophy,
                label: "₹3 Lakh",
                value: "Prize Pool",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Calendar,
                label: "Nov 28 - Dec 20",
                value: "Tournament Dates",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Award,
                label: "Premium Perks",
                value: "Jersey + Medals",
                color: "from-emerald-500 to-green-500",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative p-4 sm:p-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 hover:bg-white hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
              >
                {/* Glow on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                />

                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 mx-auto mb-2 sm:mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                <div className="text-lg sm:text-2xl font-black text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Countdown Timer - MOBILE OPTIMIZED & LEGENDARY */}
          <div className="mt-8 sm:mt-12 px-4">
            <div className="text-emerald-600 text-xs sm:text-sm font-black mb-4 flex items-center justify-center gap-2 tracking-wider">
              <Zap className="w-4 h-4 animate-pulse" />
              REGISTRATION DEADLINE
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center flex-shrink-0">
                  <div className="relative group bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 w-[70px] sm:w-[100px] shadow-[0_0_40px_rgba(16,185,129,0.3)] border-2 border-emerald-400 hover:scale-110 transition-all duration-300">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-xl sm:rounded-2xl" />

                    <div className="relative text-2xl sm:text-4xl md:text-5xl font-black text-white mb-1 sm:mb-2 drop-shadow-lg">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="relative text-[10px] sm:text-xs text-white/90 uppercase font-black tracking-widest">
                      {unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons - LEGENDARY */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12 px-4">
            <button
              onClick={() => (window.location.href = "/register-team")}
              className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-black text-base sm:text-lg hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 transition-all duration-300 shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:shadow-[0_0_80px_rgba(16,185,129,0.6)] hover:scale-105 border-2 border-emerald-400"
            >
              <span className="relative flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Register Your Team Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1xDOhSvLpaSbrZIwb_yJCoalV-6KB4nRT/view?usp=sharing",
                  "_blank"
                )
              }
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-white/80 backdrop-blur-xl border-2 border-gray-200 text-gray-900 font-black text-base sm:text-lg hover:bg-white hover:border-emerald-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              View Tournament Details
            </button>
          </div>

          {/* Trust Indicators - ENHANCED */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-xs sm:text-sm font-black mb-4 sm:mb-6 tracking-widest flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              CONFIRMED TEAMS
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
              {[
                "Nexus FC",
                "Goal Hunterz",
                "Spartans",
                "Delhi Elites",
                "Dwarka United",
              ].map((team, i) => (
                <div
                  key={i}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 text-gray-700 text-xs sm:text-sm font-bold hover:border-emerald-400/50 hover:text-emerald-600 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Zap,
  Users,
  Calendar,
  Award,
  X,
  ChevronRight,
  Sparkles,
  Target,
  Shield,
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
  const [showSignup, setShowSignup] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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

  const handleGetStarted = () => {
    setShowSignup(true);
  };

  const handleSignupComplete = () => {
    setShowSignup(false);
    setShowRegister(true);
  };

  const FloatingBall = ({
    delay,
    duration,
  }: {
    delay: number;
    duration: number;
  }) => (
    <div
      className="absolute w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full opacity-20 animate-bounce"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  );

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />

      {/* Floating Balls */}
      {[...Array(12)].map((_, i) => (
        <FloatingBall key={i} delay={i * 0.4} duration={2.5 + i * 0.3} />
      ))}

      {/* Gradient Orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[140px] opacity-30 animate-pulse"
        style={{
          transform: `translate(${mousePos.x * 0.02}px, ${
            mousePos.y * 0.02
          }px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[140px] opacity-20 animate-pulse"
        style={{
          transform: `translate(${-mousePos.x * 0.02}px, ${
            -mousePos.y * 0.02
          }px)`,
          animationDelay: "1s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        {/* Top Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-400">
              Official Community Partners
            </span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Brand Collaboration Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black">
              <span className="text-white">ROCK8</span>
              <span className="text-emerald-400 mx-4">×</span>
              <span className="text-white">WeFootballin'</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto" />
          </div>

          {/* Subtitle */}
          <h2 className="text-4xl md:text-6xl font-black text-emerald-400">
            LEAGUE 2025-26
          </h2>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Delhi's most{" "}
            <span className="text-emerald-400 font-bold">ELITE</span> football
            tournament!
            <br />
            12 teams. ₹3 Lakh prize pool. One legendary champion.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            {[
              { icon: Users, label: "12 Teams", value: "Elite Competition" },
              { icon: Trophy, label: "₹3 Lakh", value: "Prize Pool" },
              {
                icon: Calendar,
                label: "Nov 28 - Dec 20",
                value: "Tournament Dates",
              },
              { icon: Award, label: "Premium Perks", value: "Jersey + Medals" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 hover:bg-zinc-900 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="mt-12">
            <div className="text-emerald-400 text-sm font-bold mb-4 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 animate-pulse" />
              REGISTRATION DEADLINE
            </div>
            <div className="flex justify-center gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 min-w-[100px] shadow-2xl shadow-emerald-500/20 border border-emerald-400/30">
                    <div className="text-4xl md:text-5xl font-black text-black mb-2">
                      {String(value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-black/70 uppercase font-bold tracking-wider">
                      {unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button
              onClick={() => (window.location.href = "/register-team")}
              className="group relative px-10 py-5 rounded-xl bg-emerald-500 text-black font-black text-lg hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:scale-105"
            >
              <span className="relative flex items-center gap-2">
                Register Your Team Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => window.open("YOUR_GOOGLE_DOC_LINK_HERE", "_blank")}
              className="px-10 py-5 rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-900 hover:border-emerald-500/50 transition-all duration-300"
            >
              View Tournament Details
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <p className="text-gray-600 text-sm font-bold mb-6 tracking-wider">
              CONFIRMED TEAMS
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                "Nexus FC",
                "Goal Hunterz",
                "Spartans",
                "Delhi Elites",
                "Dwarka United",
              ].map((team, i) => (
                <div
                  key={i}
                  className="px-6 py-3 rounded-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-gray-400 text-sm font-bold hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                >
                  {team}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

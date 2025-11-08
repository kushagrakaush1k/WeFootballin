"use client";

import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Users,
  Trophy,
  Zap,
  Award,
  Target,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Find Games",
    description:
      "Discover football games in your area. Filter by skill level, location, and time.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Track Stats",
    description:
      "Monitor your goals, assists, and performance. Watch your rating improve over time.",
    color: "from-emerald-400 to-emerald-500",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Connect with players, form teams, and create lasting friendships on the pitch.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    description:
      "Join tournaments, climb leaderboards, and prove yourself as the best.",
    color: "from-emerald-400 to-emerald-500",
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[150px] animate-pulse" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6">
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-400">
              PLATFORM FEATURES
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Everything You </span>
            <span className="text-emerald-400">Need</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for footballers, by footballers. Your complete football
            ecosystem.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              {/* Glow Effect on Hover */}
              {hoveredIndex === index && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
              )}

              {/* Card */}
              <div className="relative h-full p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-emerald-500/20`}
                  >
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>

                  {/* Animated Ring */}
                  <div className="absolute inset-0 w-16 h-16 rounded-xl border-2 border-emerald-500/0 group-hover:border-emerald-500/50 group-hover:scale-125 transition-all duration-500" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Active Players", value: "10K+" },
            { label: "Games Hosted", value: "5K+" },
            { label: "Teams Formed", value: "500+" },
            { label: "Tournaments", value: "100+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl bg-zinc-900/30 border border-zinc-800"
            >
              <div className="text-3xl font-black text-emerald-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

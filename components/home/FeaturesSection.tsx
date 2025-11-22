"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trophy, Target, Users } from "lucide-react";

const teams = [
  { name: "Spartans FC", logo: "/images/spartans.png", captain: "John Smith" },
  { name: "Phoenix United", logo: "🔥", captain: "Mike Johnson" },
  { name: "Storm Riders", logo: "⛈️", captain: "David Lee" },
  { name: "Velocity SC", logo: "💨", captain: "Chris Brown" },
  { name: "Titans FC", logo: "🏔️", captain: "James Wilson" },
  { name: "Apex Warriors", logo: "⚔️", captain: "Robert Garcia" },
  { name: "Dynasty FC", logo: "👑", captain: "Tom Martinez" },
  { name: "Fusion United", logo: "💫", captain: "Alex Rodriguez" },
  { name: "Blaze FC", logo: "🔶", captain: "Mark Davis" },
  { name: "Legends SC", logo: "⭐", captain: "Paul Anderson" },
  { name: "Elite Rangers", logo: "🎯", captain: "Kevin Thomas" },
  { name: "Vortex United", logo: "🌪️", captain: "Brian Taylor" },
  { name: "Lunar Wolves", logo: "🐺", captain: "Steve Moore" },
  { name: "Shadow Hawks", logo: "🦅", captain: "Dan Jackson" },
  { name: "Crimson Eagles", logo: "🦅", captain: "Eric White" },
  { name: "Royal Panthers", logo: "🐆", captain: "Ryan Harris" },
];

export default function FeaturesSection() {
  const [active, setActive] = useState<number | null>(null);

  // Helper function to determine if logo is an image or emoji
  const isImageLogo = (logo: string) => logo.startsWith("/");

  return (
    <section className="bg-white min-h-[30vh] py-0 pb-12 mb-0">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="pt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight uppercase">
            <span className="text-emerald-500">THE CONTENDERS</span>
          </h1>
        </div>
        <p className="text-gray-500 text-base sm:text-lg mb-8 text-center">
          16 elite squads, one ultimate champion.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
          {teams.map((team, idx) => (
            <div key={team.name} className="flex flex-col items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex flex-col items-center focus:outline-none group cursor-pointer"
                onClick={() => setActive(active === idx ? null : idx)}
                aria-label={`View ${team.name} details`}
              >
                {/* Team Logo */}
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: active === idx ? [0, -5, 5, -5, 5, 0] : 0 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {isImageLogo(team.logo) ? (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 transition-all duration-300 group-hover:drop-shadow-2xl">
                      <Image
                        src={team.logo}
                        alt={team.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-6xl sm:text-7xl mb-2 transition-all duration-300 group-hover:drop-shadow-2xl">
                      {team.logo}
                    </span>
                  )}
                  
                  {/* Rank Badge */}
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{idx + 1}
                  </span>
                </motion.div>

                {/* Team Name */}
                <span className="text-sm sm:text-base font-bold text-gray-900 text-center px-2 group-hover:text-emerald-600 transition-colors">
                  {team.name}
                </span>

                {/* Expand Indicator */}
                <motion.div
                  animate={{ rotate: active === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1"
                >
                  <ChevronDown className="w-5 h-5 text-emerald-500" />
                </motion.div>
              </motion.button>

              {/* Stats Dropdown */}
              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full mt-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 shadow-lg overflow-hidden"
                  >
                    <div className="p-4">
                      {/* Captain */}
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-emerald-200">
                        <Users className="w-4 h-4 text-emerald-600" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-semibold">Team Captain</p>
                          <p className="text-sm font-bold text-gray-900">{team.captain}</p>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Wins</p>
                          <p className="text-lg font-black text-emerald-600">0</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Losses</p>
                          <p className="text-lg font-black text-red-500">0</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Draws</p>
                          <p className="text-lg font-black text-gray-600">0</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Points</p>
                          <p className="text-lg font-black text-emerald-600">0</p>
                        </div>
                      </div>

                      {/* Goals */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Goals For</p>
                          <p className="text-base font-black text-blue-600">0</p>
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-sm">
                          <p className="text-xs text-gray-500 font-semibold">Goals Against</p>
                          <p className="text-base font-black text-orange-600">0</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
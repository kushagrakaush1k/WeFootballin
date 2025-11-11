"use client";
import React, { useState } from "react";

const teams = [
  { name: "Thunder FC", logo: "⚡" },
  { name: "Phoenix United", logo: "🔥" },
  { name: "Storm Riders", logo: "⛈️" },
  { name: "Velocity SC", logo: "💨" },
  { name: "Titans FC", logo: "🏔️" },
  { name: "Apex Warriors", logo: "⚔️" },
  { name: "Dynasty FC", logo: "👑" },
  { name: "Fusion United", logo: "💫" },
  { name: "Blaze FC", logo: "🔶" },
  { name: "Legends SC", logo: "⭐" },
  { name: "Elite Rangers", logo: "🎯" },
  { name: "Vortex United", logo: "🌪️" },
  { name: "Lunar Wolves", logo: "🐺" },
  { name: "Shadow Hawks", logo: "🦅" },
  { name: "Crimson Eagles", logo: "🦅" },
  { name: "Royal Panthers", logo: "🐆" },
];

export default function FeaturesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-white min-h-[30vh] py-0 pb-0 mb-0">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Added padding-top for vertical spacing above the heading */}
        <div className="pt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-2 tracking-tight uppercase">
            <span className="text-emerald-500">THE CONTENDERS</span>
          </h1>
        </div>
        <p className="text-gray-500 text-base sm:text-lg mb-3 text-center">
          16 elite squads, one ultimate champion.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 mb-0">
          {teams.map((team, idx) => (
            <button
              key={team.name}
              className={`rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow hover:shadow-lg flex flex-col items-center px-2 py-5 relative transition-all duration-200 focus:outline-none ${
                active === idx ? "ring-2 ring-emerald-400" : ""
              }`}
              onClick={() => setActive(active === idx ? null : idx)}
              aria-label={`View ${team.name} details`}
              tabIndex={0}
            >
              <span className="text-3xl sm:text-4xl mb-1">{team.logo}</span>
              <span className="text-base font-semibold text-gray-900">
                {team.name}
              </span>
              <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-600 text-xs font-bold px-2 py-1 rounded-full shadow">
                #{idx + 1}
              </span>
              <div
                className={`mt-3 w-full flex flex-wrap justify-center gap-2 text-xs transition-all overflow-hidden ${
                  active === idx ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <span className="bg-emerald-50 px-2 py-1 rounded text-emerald-500 font-semibold shadow">
                  Wins: 0
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-400">
                  Losses: 0
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-400">
                  Draws: 0
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-400">
                  GF: 0
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-400">
                  GA: 0
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-400">
                  Points: 0
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <style jsx global>
        {`
          @media (max-width: 640px) {
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            button {
              min-width: 0;
            }
          }
        `}
      </style>
    </section>
  );
}

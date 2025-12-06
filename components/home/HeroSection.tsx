"use client";

import React from "react";
import { Trophy, Zap, ChevronRight, FileText, Flame } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  const TOURNAMENT_DETAILS_LINK =
    "https://drive.google.com/file/d/1xDOhSvLpaSbrZIwb_yJCoalV-6KB4nRT/view?usp=sharing";

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: "url(/images/wefootballin-cover.png)",
      }}
    >
      {/* Elegant dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            animate={{
              y: [Math.random() * window.innerHeight, -100],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Tournament Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/30 to-green-500/30 backdrop-blur-xl border-2 border-emerald-400/50 rounded-full px-8 py-4 shadow-2xl">
            <Flame className="w-6 h-6 text-emerald-300 animate-pulse" />
            <span className="text-base font-black text-white uppercase tracking-wider">
              🏆 ROCK8 LEAGUE IS LIVE 🏆
            </span>
            <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight">
            <motion.span
              className="block text-white drop-shadow-2xl mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The Battle Has Begun!
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl text-5xl sm:text-6xl md:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Check Live Standings Now
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-emerald-100 text-xl md:text-2xl font-bold mb-12 max-w-3xl mx-auto"
        >
          Watch the champions rise in real-time as teams battle for glory! 🔥
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 mt-10"
        >
          <Link href="/leaderboard">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black py-5 px-12 rounded-2xl text-lg transition-all duration-300 shadow-2xl flex items-center gap-3 w-full sm:w-auto overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <Trophy className="w-6 h-6 relative z-10" />
              <span className="relative z-10">View Leaderboard</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
          </Link>

          <a href={TOURNAMENT_DETAILS_LINK} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white font-black py-5 px-12 rounded-2xl text-lg transition-all duration-300 border-3 border-white/40 hover:border-white/60 flex items-center gap-3 w-full sm:w-auto shadow-2xl"
            >
              <FileText className="w-6 h-6" />
              Tournament Details
            </motion.button>
          </a>
        </motion.div>

        {/* Stats - Clean and Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "₹3L+", label: "Prize Pool", icon: "💰" },
            { value: "16", label: "Teams Fighting", icon: "🏆" },
            { value: "LIVE", label: "In Progress", icon: "⚽" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="text-center group relative"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-white/30 hover:border-emerald-400/60 transition-all duration-300 shadow-2xl relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <div className="text-4xl sm:text-5xl mb-3 relative z-10">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-400 mb-2 relative z-10">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-white/90 font-bold uppercase tracking-wide relative z-10">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-red-500/20 backdrop-blur-xl border-2 border-red-400/50 rounded-full">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-white font-black text-sm uppercase tracking-wider">
              Tournament In Progress
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-3 bg-white/70 rounded-full"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
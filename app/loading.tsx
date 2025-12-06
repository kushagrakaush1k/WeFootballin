"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  initialX: number;
  initialY: number;
  targetY: number;
  targetX: number;
  duration: number;
  delay: number;
}

export default function Loading() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on client side after mount
    const newParticles = Array.from({ length: 20 }, () => ({
      initialX: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
      initialY: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      targetY: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      targetX: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
      />

      {/* Floating Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
          animate={{
            y: [particle.initialY, particle.targetY],
            x: [particle.initialX, particle.targetX],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Loading Spinner */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-6"
        />
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Loading...
        </h2>
        <p className="text-gray-600 mt-4 font-semibold">Preparing your experience</p>
      </div>
    </div>
  );
}
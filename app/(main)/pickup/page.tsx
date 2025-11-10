"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function PickupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            COMING SOON
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            Pickup Games
          </p>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-3"
        >
          <p className="text-lg text-gray-700 leading-relaxed">
            We're building the ultimate platform to find and join pickup games
            near you. Get ready to experience spontaneous football like never
            before.
          </p>
          <p className="text-base text-gray-600">
            Quick. Local. Community-driven.
          </p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-emerald-500"
            />
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link href="/">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200">
              <span>Back to Home</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>

        {/* Beta Notification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-600">
            🔔 Be the first to know when we launch.{" "}
            <span className="text-emerald-600 font-semibold">
              Join our list!
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

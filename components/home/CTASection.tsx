"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Trophy, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white via-emerald-50/40 to-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-50 via-white to-green-50/50 backdrop-blur-xl border-2 border-emerald-200 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-xl shadow-emerald-500/10"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-2 border-emerald-300 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-700">
                LIMITED SLOTS AVAILABLE
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-gray-900">Ready to Join </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                ROCK8 League?
              </span>
            </h2>

            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Register your team now and be part of India's most exciting
              football tournament
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register-team">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-lg font-bold rounded-xl shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-3 group border-2 border-white"
                >
                  <Trophy className="w-6 h-6" />
                  Register Your Team
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>

              <Link href="/leaderboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-300 text-gray-900 text-lg font-bold rounded-xl transition-all shadow-lg"
                >
                  View Leaderboard
                </motion.button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-12 pt-12 border-t-2 border-emerald-200 grid grid-cols-3 gap-8"
            >
              {[
                { label: "Teams", value: "50+" },
                { label: "Prize Pool", value: "₹3L+" },
                { label: "Matches", value: "100+" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-emerald-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
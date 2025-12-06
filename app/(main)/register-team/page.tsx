"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterTeamPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/leaderboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-24 pb-16 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2, duration: 0.8 }}
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl"
          >
            <Lock className="w-16 h-16 text-white" />
          </motion.div>

          {/* Main Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-gray-900 mb-6"
          >
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Registration Closed
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-gray-700 font-bold mb-4"
          >
            The Tournament Has Begun! 🔥
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Team registrations are now closed. The ROCK8 League is in full
            swing! Check out the live leaderboard to see who's leading the pack.
          </motion.p>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/95 backdrop-blur-xl border-2 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-2xl mb-10 max-w-2xl mx-auto"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Watch the Action Live
                </h3>
                <p className="text-gray-700 font-semibold">
                  Follow every goal, every match, and every moment as teams
                  battle for the championship. See live standings, stats, and
                  highlights on our leaderboard!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <h4 className="font-black text-lg text-gray-900">
                  Stay Updated
                </h4>
              </div>
              <ul className="space-y-2 text-left text-gray-700 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">•</span>
                  <span>Real-time standings and match results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">•</span>
                  <span>Team statistics and performance metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-black">•</span>
                  <span>Track your favorite teams to victory!</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/leaderboard">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-emerald-300/50 transition-all text-lg"
              >
                <Trophy className="w-6 h-6" />
                View Live Leaderboard
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>

            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border-3 border-emerald-300 text-gray-900 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-xl text-lg"
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>

          {/* Auto-redirect notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-10 text-gray-600 font-semibold"
          >
            Redirecting to leaderboard in 5 seconds...
          </motion.p>

          {/* Contact */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-gray-600 font-semibold"
          >
            Questions? Contact us at{" "}
            <a
              href="mailto:wefootballin@gmail.com"
              className="text-emerald-600 hover:text-emerald-700 font-black"
            >
              wefootballin@gmail.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

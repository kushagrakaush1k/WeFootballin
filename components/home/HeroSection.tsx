"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden pt-16 pb-8">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Prize Pool Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto mb-8 px-4"
      >
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-black mb-6 text-center">
            <Trophy className="w-8 h-8 inline mr-2" />
            PRIZE POOL & DELIVERABLES
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-yellow-600 mb-2">
                ₹3L+
              </div>
              <div className="text-sm text-muted-foreground">
                Total Prize Money
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold mb-2">Delhi Heights</div>
              <div className="text-sm text-muted-foreground">
                Premium Beverages
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold mb-2">Iki Gai & More</div>
              <div className="text-sm text-muted-foreground">
                Exclusive Rewards
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Join the movement
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-600 bg-clip-text text-transparent">
              We
            </span>
            <span className="text-foreground">Footballin'</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Find games. Track stats. Connect with players.
            <br />
            <span className="text-foreground font-semibold">
              Your ultimate football community.
            </span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/games">
              <Button
                size="lg"
                className="football-gradient text-white text-lg px-10 h-14 group shadow-lg hover:shadow-primary/50 transition-all"
              >
                Find Games
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 h-14 border-2 hover:bg-primary/5"
              >
                Sign Up Free
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

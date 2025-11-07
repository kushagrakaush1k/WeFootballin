'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-green-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-background" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            WeFootballin'
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgb(16 185 129 / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(16 185 129 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full"
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            opacity: 0,
          }}
          animate={{
            y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : [0, 100],
            x: typeof window !== 'undefined' ? [null, Math.random() * window.innerWidth] : [0, 100],
            opacity: [0, 0.6, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Rotating Stadium/Field Effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-96 h-96 border-4 border-emerald-500/20 rounded-full" />
          <div className="absolute w-72 h-72 border-4 border-emerald-500/30 rounded-full" />
          <div className="absolute w-48 h-48 border-4 border-emerald-500/40 rounded-full" />
        </motion.div>

        {/* Center Football Animation */}
        <motion.div
          className="relative mb-12"
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Football/Soccer Ball */}
          <motion.div
            className="relative w-32 h-32"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            {/* Ball base */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-300 shadow-2xl shadow-emerald-500/50" />
            
            {/* Pentagon pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-slate-800 transform rotate-0" style={{
                clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
              }} />
            </div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400 blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Bounce shadow */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-4 bg-emerald-500/30 rounded-full blur-md"
            animate={{
              scale: [1, 0.8, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Brand Name with Epic Typography */}
        <div className="relative mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black tracking-tight relative"
          >
            {/* Background text for depth */}
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent blur-sm">
              WeFootballin'
            </span>
            
            {/* Main text */}
            <span className="relative bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 bg-clip-text text-transparent">
              WeFootballin'
            </span>
            
            {/* Shine effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 1,
              }}
            />
          </motion.h1>
        </div>

        {/* Loading Text */}
        <motion.div
          className="text-emerald-300 text-xl font-semibold mb-8 tracking-wider"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span>LOADING THE PITCH</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2, times: [0, 0.5, 1] }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4, times: [0, 0.5, 1] }}
          >
            .
          </motion.span>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-96 max-w-md">
          <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-emerald-500/20">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-400/20 to-emerald-500/20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Progress fill */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 shadow-lg shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </div>
          
          {/* Progress percentage */}
          <motion.div
            className="text-center mt-3 text-emerald-400 font-bold text-sm tracking-widest"
            key={progress}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {progress}%
          </motion.div>
        </div>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 text-emerald-500/60 text-sm text-center max-w-md px-4"
        >
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Preparing the ultimate football experience...
          </motion.p>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-emerald-500/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-emerald-500/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-emerald-500/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-emerald-500/30" />
    </div>
  );
}
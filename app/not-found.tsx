'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-black bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you've kicked the ball out of bounds. Let's get you back in the game!
          </p>
          <Link href="/">
            <Button size="lg" className="football-gradient text-white">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
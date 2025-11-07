'use client';

import { GameCard } from '@/components/dashboard/GameCard';
import { motion } from 'framer-motion';

interface Game {
  id: string;
  title: string;
  location: string;
  date: Date;
  currentPlayers: number;
  maxPlayers: number;
  skillLevel: string;
}

interface GamesListProps {
  games: Game[];
}

export function GamesList({ games }: GamesListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} index={index} />
      ))}
    </motion.div>
  );
}
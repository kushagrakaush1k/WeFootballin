'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    location: string;
    date: Date;
    currentPlayers: number;
    maxPlayers: number;
    skillLevel: string;
  };
  isHost?: boolean;
  index: number;
}

export function GameCard({ game, isHost = false, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/games/${game.id}`}>
        <Card className="hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full">
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {game.title}
              </CardTitle>
              <Badge variant={isHost ? 'default' : 'secondary'}>
                {isHost ? 'Hosting' : game.skillLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              {formatDateTime(game.date)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              {game.location}
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span className="font-medium">
                {game.currentPlayers} / {game.maxPlayers} players
              </span>
            </div>
            <div className="pt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${(game.currentPlayers / game.maxPlayers) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
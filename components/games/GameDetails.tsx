'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface GameDetailsProps {
  game: {
    title: string;
    description: string | null;
    location: string;
    address: string;
    date: Date;
    duration: number;
    currentPlayers: number;
    maxPlayers: number;
    skillLevel: string;
    status: string;
    host: {
      name: string | null;
      email: string;
    };
    participants: Array<{
      user: {
        name: string | null;
        email: string;
      };
    }>;
  };
}

export function GameDetails({ game }: GameDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {game.description && (
        <p className="text-lg text-muted-foreground leading-relaxed">{game.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Calendar} label="Date & Time" value={new Date(game.date).toLocaleString()} />
        <InfoCard icon={Clock} label="Duration" value={`${game.duration} minutes`} />
        <InfoCard
          icon={MapPin}
          label="Location"
          value={game.location}
          subValue={game.address}
        />
        <InfoCard
          icon={Users}
          label="Players"
          value={`${game.currentPlayers} / ${game.maxPlayers}`}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Hosted by
        </h3>
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-white font-semibold">
              {game.host.name?.charAt(0).toUpperCase() || 'H'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{game.host.name || 'Host'}</p>
            <p className="text-sm text-muted-foreground">{game.host.email}</p>
          </div>
        </div>
      </div>

      {game.participants.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Players Joined ({game.participants.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {game.participants.map((participant, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-primary/20">
                    {participant.user.name?.charAt(0).toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-medium truncate">
                  {participant.user.name || 'Player'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: any;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <Icon className="w-5 h-5 text-primary mt-0.5" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
        {subValue && <p className="text-sm text-muted-foreground mt-1">{subValue}</p>}
      </div>
    </div>
  );
}
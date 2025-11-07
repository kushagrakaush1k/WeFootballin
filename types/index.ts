import { Database } from '@/lib/supabase/database.types';

export type User = Database['public']['Tables']['users']['Row'];
export type PlayerStats = Database['public']['Tables']['player_stats']['Row'];
export type Game = Database['public']['Tables']['games']['Row'];
export type GameParticipant = Database['public']['Tables']['game_participants']['Row'];

export type UserWithStats = User & {
  player_stats: PlayerStats | null;
};

export type GameWithDetails = Game & {
  host: User;
  participants: (GameParticipant & { user: User })[];
};

export type Role = 'PLAYER' | 'ADMIN';
export type GameStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export type ParticipantStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';
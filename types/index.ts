// Remove the Database import and use direct types instead

export type Team = {
  id: string;
  user_id: string;
  team_name: string;
  league_group: 'A' | 'B' | 'C' | null;
  payment_screenshot_url: string | null;
  payment_status: 'pending' | 'approved' | 'rejected';
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  created_at: string;
  updated_at: string;
};

export type TeamPlayer = {
  id: string;
  team_id: string;
  player_name: string;
  phone: string;
  instagram: string | null;
  is_captain: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type PlayerStats = {
  id: string;
  user_id: string;
  games_played: number;
  wins: number;
  losses: number;
  goals_scored: number;
  assists: number;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  location: string;
  date: string;
  max_players: number;
  status: GameStatus;
  created_at: string;
  updated_at: string;
};

export type GameParticipant = {
  id: string;
  game_id: string;
  user_id: string;
  status: ParticipantStatus;
  created_at: string;
};

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
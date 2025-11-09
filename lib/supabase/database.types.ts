// Database type definitions for Supabase
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

// Auth types
export type SignUpData = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: any;
  error: string | null;
};

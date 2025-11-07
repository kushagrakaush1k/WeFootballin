export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'player' | 'admin'
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          role?: 'player' | 'admin'
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: 'player' | 'admin'
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          team_name: string
          captain_id: string | null
          league_group: 'A' | 'B' | 'C' | 'UNASSIGNED'
          payment_status: 'pending' | 'approved' | 'rejected'
          payment_screenshot_url: string | null
          google_form_submission_id: string | null
          total_players: number
          created_at: string
          updated_at: string
          matches_played: number
          wins: number
          draws: number
          losses: number
          goals_for: number
          goals_against: number
          goal_difference: number
          points: number
        }
        Insert: {
          id?: string
          team_name: string
          captain_id?: string | null
          league_group?: 'A' | 'B' | 'C' | 'UNASSIGNED'
          payment_status?: 'pending' | 'approved' | 'rejected'
          payment_screenshot_url?: string | null
          google_form_submission_id?: string | null
          total_players?: number
          created_at?: string
          updated_at?: string
          matches_played?: number
          wins?: number
          draws?: number
          losses?: number
          goals_for?: number
          goals_against?: number
          goal_difference?: number
          points?: number
        }
        Update: {
          id?: string
          team_name?: string
          captain_id?: string | null
          league_group?: 'A' | 'B' | 'C' | 'UNASSIGNED'
          payment_status?: 'pending' | 'approved' | 'rejected'
          payment_screenshot_url?: string | null
          google_form_submission_id?: string | null
          total_players?: number
          created_at?: string
          updated_at?: string
          matches_played?: number
          wins?: number
          draws?: number
          losses?: number
          goals_for?: number
          goals_against?: number
          goal_difference?: number
          points?: number
        }
      }
      team_players: {
        Row: {
          id: string
          team_id: string
          player_name: string
          phone: string
          instagram: string | null
          is_captain: boolean
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          player_name: string
          phone: string
          instagram?: string | null
          is_captain?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          player_name?: string
          phone?: string
          instagram?: string | null
          is_captain?: boolean
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          team1_id: string | null
          team2_id: string | null
          team1_goals: number
          team2_goals: number
          match_date: string | null
          match_type: 'league' | 'main_cup' | 'shield_cup'
          league_group: 'A' | 'B' | 'C' | null
          status: 'scheduled' | 'live' | 'completed' | 'cancelled'
          venue: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team1_id?: string | null
          team2_id?: string | null
          team1_goals?: number
          team2_goals?: number
          match_date?: string | null
          match_type?: 'league' | 'main_cup' | 'shield_cup'
          league_group?: 'A' | 'B' | 'C' | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          venue?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team1_id?: string | null
          team2_id?: string | null
          team1_goals?: number
          team2_goals?: number
          match_date?: string | null
          match_type?: 'league' | 'main_cup' | 'shield_cup'
          league_group?: 'A' | 'B' | 'C' | null
          status?: 'scheduled' | 'live' | 'completed' | 'cancelled'
          venue?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type Team = Database['public']['Tables']['teams']['Row']
export type TeamPlayer = Database['public']['Tables']['team_players']['Row']
export type Match = Database['public']['Tables']['matches']['Row']

export type TeamWithPlayers = Team & {
  team_players: TeamPlayer[]
  captain: Pick<User, 'id' | 'name' | 'email'> | null
}

export type MatchWithTeams = Match & {
  team1: Pick<Team, 'id' | 'team_name'> | null
  team2: Pick<Team, 'id' | 'team_name'> | null
}

export type LeaderboardTeam = Team & {
  position: number
  qualification: 'main_cup' | 'shield_cup' | 'none'
}
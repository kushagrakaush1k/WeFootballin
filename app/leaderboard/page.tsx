'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Team } from '@/lib/supabase/database.types';
import { Trophy, TrendingUp, Shield, Medal, Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LeagueGroup = 'A' | 'B' | 'C';

interface LeaderboardTeam extends Team {
  position: number;
  qualification: 'main_cup' | 'shield_cup' | 'none';
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Record<LeagueGroup, LeaderboardTeam[]>>({
    A: [],
    B: [],
    C: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState<LeagueGroup>('A');

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time updates
    const supabase = createClient();
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('payment_status', 'approved')
      .neq('league_group', 'UNASSIGNED')
      .order('league_group')
      .order('points', { ascending: false })
      .order('goal_difference', { ascending: false })
      .order('goals_for', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
      return;
    }

    // Group teams by league and add position/qualification
    const grouped: Record<LeagueGroup, LeaderboardTeam[]> = { A: [], B: [], C: [] };
    
    ['A', 'B', 'C'].forEach((league) => {
      const leagueTeams = data.filter((t) => t.league_group === league);
      grouped[league as LeagueGroup] = leagueTeams.map((team, idx) => ({
        ...team,
        position: idx + 1,
        qualification: idx < 2 ? 'main_cup' : idx >= 2 ? 'shield_cup' : 'none',
      }));
    });

    setTeams(grouped);
    setLoading(false);
  };

  const renderLeaderboard = (leagueTeams: LeaderboardTeam[]) => {
    if (leagueTeams.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No teams in this league yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {leagueTeams.map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative overflow-hidden rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
              team.qualification === 'main_cup'
                ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-transparent'
                : team.qualification === 'shield_cup'
                ? 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-transparent'
                : 'border-border bg-card'
            }`}
          >
            {/* Qualification Badge */}
            {team.qualification !== 'none' && (
              <div
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  team.qualification === 'main_cup'
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                    : 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                }`}
              >
                {team.qualification === 'main_cup' ? (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Main Cup
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Shield Cup
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-6">
              {/* Position */}
              <div className="flex-shrink-0">
                {team.position <= 3 ? (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-black ${
                      team.position === 1
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                        : team.position === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                        : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                    }`}
                  >
                    {team.position === 1 && <Trophy className="w-6 h-6" />}
                    {team.position === 2 && <Medal className="w-6 h-6" />}
                    {team.position === 3 && <Medal className="w-5 h-5" />}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                    {team.position}
                  </div>
                )}
              </div>

              {/* Team Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold truncate">{team.team_name}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>{team.total_players} Players</span>
                  {team.matches_played > 0 && (
                    <span>
                      <Flame className="w-3 h-3 inline mr-1" />
                      {team.matches_played} Matches
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:grid grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{team.matches_played}</div>
                  <div className="text-xs text-muted-foreground">MP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{team.wins}</div>
                  <div className="text-xs text-muted-foreground">W</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{team.draws}</div>
                  <div className="text-xs text-muted-foreground">D</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{team.losses}</div>
                  <div className="text-xs text-muted-foreground">L</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{team.goals_for}:{team.goals_against}</div>
                  <div className="text-xs text-muted-foreground">GF:GA</div>
                </div>
              </div>

              {/* Points */}
              <div className="flex-shrink-0">
                <div className="bg-primary text-primary-foreground rounded-lg px-6 py-3 text-center">
                  <div className="text-3xl font-black">{team.points}</div>
                  <div className="text-xs font-semibold">PTS</div>
                </div>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="md:hidden mt-4 pt-4 border-t grid grid-cols-5 gap-2 text-center text-sm">
              <div>
                <div className="font-bold">{team.matches_played}</div>
                <div className="text-xs text-muted-foreground">MP</div>
              </div>
              <div>
                <div className="font-bold text-green-600">{team.wins}</div>
                <div className="text-xs text-muted-foreground">W</div>
              </div>
              <div>
                <div className="font-bold text-yellow-600">{team.draws}</div>
                <div className="text-xs text-muted-foreground">D</div>
              </div>
              <div>
                <div className="font-bold text-red-600">{team.losses}</div>
                <div className="text-xs text-muted-foreground">L</div>
              </div>
              <div>
                <div className="font-bold">{team.goals_for}:{team.goals_against}</div>
                <div className="text-xs text-muted-foreground">GF:GA</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-600 bg-clip-text text-transparent">
              Live
            </span>
            <span className="text-foreground"> Leaderboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            ROCK8 League - Season 2024/25
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold">Top 2: Main Cup</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold">Bottom 2: Shield Cup</span>
            </div>
          </div>
        </motion.div>

        {/* League Tabs */}
        <Tabs value={activeLeague} onValueChange={(v) => setActiveLeague(v as LeagueGroup)}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="A" className="text-lg font-bold">
              League A
            </TabsTrigger>
            <TabsTrigger value="B" className="text-lg font-bold">
              League B
            </TabsTrigger>
            <TabsTrigger value="C" className="text-lg font-bold">
              League C
            </TabsTrigger>
          </TabsList>

          <TabsContent value="A">{renderLeaderboard(teams.A)}</TabsContent>
          <TabsContent value="B">{renderLeaderboard(teams.B)}</TabsContent>
          <TabsContent value="C">{renderLeaderboard(teams.C)}</TabsContent>
        </Tabs>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-card border border-border rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div><span className="font-semibold">MP:</span> Matches Played</div>
            <div><span className="font-semibold">W:</span> Wins</div>
            <div><span className="font-semibold">D:</span> Draws</div>
            <div><span className="font-semibold">L:</span> Losses</div>
            <div><span className="font-semibold">GF:GA:</span> Goals For/Against</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
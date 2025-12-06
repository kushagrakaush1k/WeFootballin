"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Target,
  Zap,
  Crown,
  Flame,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Team {
  id: string;
  team_name: string;
  league_group: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  goal_difference: number;
}

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<"A" | "B" | "C" | "D" | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchTeams();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('teams-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'teams' },
        () => {
          console.log('Team data changed, refreshing...');
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("teams")
        .select("*")
        .eq("payment_status", "approved")
        .order("points", { ascending: false })
        .order("goal_difference", { ascending: false })
        .order("goals_for", { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched teams:", data);
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeams = selectedGroup === "ALL" 
    ? teams 
    : teams.filter(t => t.league_group === selectedGroup);

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full shadow-lg"
        >
          <Crown className="w-5 h-5 text-white" />
          <span className="text-white font-black">1ST</span>
        </motion.div>
      );
    }
    if (index === 1) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full shadow-lg"
        >
          <Medal className="w-5 h-5 text-white" />
          <span className="text-white font-black">2ND</span>
        </motion.div>
      );
    }
    if (index === 2) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg"
        >
          <Award className="w-5 h-5 text-white" />
          <span className="text-white font-black">3RD</span>
        </motion.div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center border-2 border-emerald-300">
        <span className="text-emerald-700 font-black text-lg">{index + 1}</span>
      </div>
    );
  };

  const groups = [
    { value: "ALL", label: "All Teams" },
    { value: "A", label: "Group A" },
    { value: "B", label: "Group B" },
    { value: "C", label: "Group C" },
    { value: "D", label: "Group D" },
  ] as const;

  const stats = {
    totalTeams: filteredTeams.length,
    totalMatches: filteredTeams.reduce((sum, t) => sum + t.matches_played, 0),
    totalGoals: filteredTeams.reduce((sum, t) => sum + t.goals_for, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 shadow-2xl"
          >
            <Flame className="w-6 h-6 text-white animate-pulse" />
            <span className="text-sm font-black text-white uppercase tracking-wider">ROCK8 LEAGUE STANDINGS</span>
            <Trophy className="w-6 h-6 text-yellow-300" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-lg">
              Live Leaderboard
            </span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <p className="text-xl md:text-2xl text-gray-600 font-bold">Track the champions in real-time 🔥</p>
            <button
              onClick={fetchTeams}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-10">
          {groups.map((group, idx) => (
            <motion.button
              key={group.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGroup(group.value)}
              className={`relative px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-lg overflow-hidden ${
                selectedGroup === group.value
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-emerald-300/50 scale-105"
                  : "bg-white text-gray-700 hover:bg-emerald-50 border-2 border-emerald-200"
              }`}
            >
              {selectedGroup === group.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600"
                  transition={{ type: "spring", duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{group.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Target, label: "Teams", value: stats.totalTeams, color: "emerald" },
            { icon: Zap, label: "Matches", value: stats.totalMatches, color: "blue" },
            { icon: TrendingUp, label: "Goals", value: stats.totalGoals, color: "purple" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-white/80 backdrop-blur-xl border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                </div>
                <div className="text-5xl font-black text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/95 backdrop-blur-xl border-2 border-emerald-200 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6">
            <div className="grid grid-cols-12 gap-4 text-sm font-black text-white uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Team</div>
              <div className="col-span-1 text-center hidden md:block">MP</div>
              <div className="col-span-1 text-center">W</div>
              <div className="col-span-1 text-center">D</div>
              <div className="col-span-1 text-center">L</div>
              <div className="col-span-1 text-center hidden md:block">GD</div>
              <div className="col-span-2 text-center">PTS</div>
            </div>
          </div>

          <div className="divide-y-2 divide-emerald-100">
            {isLoading ? (
              <div className="p-16 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
                />
                <p className="text-gray-600 mt-6 font-bold">Loading teams from database...</p>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="p-16 text-center">
                <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-xl font-bold text-gray-600">No teams found</p>
                <p className="text-gray-500 mt-2">
                  {selectedGroup === "ALL"
                    ? "Teams will appear here once they're added"
                    : `No teams in Group ${selectedGroup} yet`}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 gap-4 px-8 py-6 hover:bg-emerald-50/50 transition-all group ${
                      index === 0 ? "bg-yellow-50/30" : index === 1 ? "bg-gray-50/30" : index === 2 ? "bg-orange-50/30" : ""
                    }`}
                  >
                    <div className="col-span-1 flex items-center">{getRankBadge(index)}</div>
                    <div className="col-span-4 flex items-center">
                      <div>
                        <div className="font-black text-lg text-gray-900 group-hover:text-emerald-600 transition-colors">{team.team_name}</div>
                        <div className="text-xs font-bold text-gray-500 mt-1">Group {team.league_group}</div>
                      </div>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center justify-center text-gray-700 font-bold">{team.matches_played}</div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-black">{team.wins}</div>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg font-black">{team.draws}</div>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="px-3 py-1 bg-red-100 text-red-700 rounded-lg font-black">{team.losses}</div>
                    </div>
                    <div className="col-span-1 hidden md:flex items-center justify-center">
                      <div className={`px-3 py-1 rounded-lg font-black ${
                          team.goal_difference > 0 ? "bg-green-100 text-green-700" : 
                          team.goal_difference < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {team.goal_difference > 0 ? "+" : ""}{team.goal_difference}
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
                        <span className="text-2xl font-black text-white">{team.points}</span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-600">
          {[
            { label: "MP", desc: "Matches Played" },
            { label: "W", desc: "Wins" },
            { label: "D", desc: "Draws" },
            { label: "L", desc: "Losses" },
            { label: "GD", desc: "Goal Difference" },
            { label: "PTS", desc: "Points" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-black">{item.label}</span>
              <span>{item.desc}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
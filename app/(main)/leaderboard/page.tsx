"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, TrendingUp, Target, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Team } from "@/lib/supabase/database.types";

export default function LeaderboardPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<"A" | "B" | "C" | "ALL">(
    "ALL"
  );
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchTeams();

    // Set up real-time subscription
    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
        },
        (payload) => {
          console.log("Team changed:", payload);
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedGroup]);

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

      if (selectedGroup !== "ALL") {
        query = query.eq("league_group", selectedGroup);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching teams:", error);
      } else {
        setTeams(data || []);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-orange-600" />;
      default:
        return (
          <span className="text-gray-500 font-bold text-lg">#{index + 1}</span>
        );
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500/20 border-yellow-500/50";
      case 1:
        return "bg-gray-400/20 border-gray-400/50";
      case 2:
        return "bg-orange-500/20 border-orange-500/50";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const groups = [
    { value: "ALL", label: "All Groups", color: "emerald" },
    { value: "A", label: "Group A", color: "blue" },
    { value: "B", label: "Group B", color: "purple" },
    { value: "C", label: "Group C", color: "pink" },
  ] as const;

  const stats = [
    {
      icon: Target,
      label: "Total Teams",
      value: teams.length,
      color: "emerald",
    },
    {
      icon: Zap,
      label: "Matches Played",
      value: teams.reduce((sum, t) => sum + t.matches_played, 0),
      color: "blue",
    },
    {
      icon: TrendingUp,
      label: "Total Goals",
      value: teams.reduce((sum, t) => sum + t.goals_for, 0),
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">
              ROCK8 LEAGUE
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Live standings updated in real-time
          </p>
        </motion.div>

        {/* Group Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {groups.map((group) => (
            <motion.button
              key={group.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGroup(group.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedGroup === group.value
                  ? `bg-${group.color}-500 text-white shadow-lg`
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {group.label}
            </motion.button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <stat.icon className={`w-8 h-8 text-${stat.color}-400 mb-3`} />
              <div className="text-3xl font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 px-6 py-4 border-b border-white/10">
            <div className="grid grid-cols-12 gap-4 text-sm font-bold text-emerald-400 uppercase tracking-wider">
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

          {/* Table Body */}
          <div className="divide-y divide-white/10">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Loading teams...</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">No teams found</p>
                <p className="text-sm mt-2">
                  {selectedGroup === "ALL"
                    ? "No approved teams yet"
                    : `No approved teams in Group ${selectedGroup}`}
                </p>
              </div>
            ) : (
              teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors group ${
                    index < 3 ? getRankBadgeColor(index) : ""
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {team.team_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Group {team.league_group}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:flex items-center justify-center text-gray-400">
                    {team.matches_played}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-green-400 font-semibold">
                    {team.wins}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-yellow-400 font-semibold">
                    {team.draws}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-red-400 font-semibold">
                    {team.losses}
                  </div>
                  <div className="col-span-1 hidden md:flex items-center justify-center text-gray-300 font-semibold">
                    {team.goal_difference > 0 ? "+" : ""}
                    {team.goal_difference}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="px-4 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                      <span className="text-xl font-black text-emerald-400">
                        {team.points}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-400"
        >
          <div>MP: Matches Played</div>
          <div>W: Wins</div>
          <div>D: Draws</div>
          <div>L: Losses</div>
          <div>GD: Goal Difference</div>
          <div>PTS: Points</div>
        </motion.div>
      </div>
    </div>
  );
}

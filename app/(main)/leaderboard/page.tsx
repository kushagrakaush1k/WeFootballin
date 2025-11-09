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
  }, [selectedGroup]);

  const fetchTeams = async () => {
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

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-500" />;
    if (index === 2) return <Award className="w-6 h-6 text-orange-500" />;
    return (
      <span className="text-gray-600 font-bold text-lg">#{index + 1}</span>
    );
  };

  const groups = [
    { value: "ALL", label: "All Groups" },
    { value: "A", label: "Group A" },
    { value: "B", label: "Group B" },
    { value: "C", label: "Group C" },
  ] as const;

  const stats = {
    totalTeams: teams.length,
    totalMatches: teams.reduce((sum, t) => sum + t.matches_played, 0),
    totalGoals: teams.reduce((sum, t) => sum + t.goals_for, 0),
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-300 rounded-full mb-6 shadow-sm">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">
              ROCK8 LEAGUE
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Live standings updated in real-time
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {groups.map((group) => (
            <button
              key={group.value}
              onClick={() => setSelectedGroup(group.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedGroup === group.value
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-300/50"
                  : "bg-white text-gray-700 hover:bg-emerald-50 border-2 border-emerald-200 shadow-sm"
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Target, label: "Total Teams", value: stats.totalTeams },
            { icon: Zap, label: "Matches Played", value: stats.totalMatches },
            { icon: TrendingUp, label: "Total Goals", value: stats.totalGoals },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border-2 border-emerald-200 rounded-2xl p-6 shadow-lg"
            >
              <stat.icon className="w-8 h-8 text-emerald-600 mb-3" />
              <div className="text-3xl font-black text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/95 backdrop-blur-xl border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b-2 border-emerald-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-bold text-emerald-700 uppercase tracking-wider">
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

          <div className="divide-y divide-emerald-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-gray-600 mt-4">Loading teams...</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="p-12 text-center text-gray-600">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-semibold">No teams found</p>
                <p className="text-sm mt-2">
                  {selectedGroup === "ALL"
                    ? "No teams registered yet"
                    : `No teams in Group ${selectedGroup} yet`}
                </p>
              </div>
            ) : (
              teams.map((team, index) => (
                <div
                  key={team.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div>
                      <div className="font-bold text-gray-900">
                        {team.team_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Group {team.league_group}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 hidden md:flex items-center justify-center text-gray-600 font-medium">
                    {team.matches_played}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-green-600 font-semibold">
                    {team.wins}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-yellow-600 font-semibold">
                    {team.draws}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-red-600 font-semibold">
                    {team.losses}
                  </div>
                  <div className="col-span-1 hidden md:flex items-center justify-center text-gray-700 font-semibold">
                    {team.goal_difference > 0 ? "+" : ""}
                    {team.goal_difference}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="px-4 py-1 bg-emerald-100 border-2 border-emerald-300 rounded-lg shadow-sm">
                      <span className="text-xl font-black text-emerald-700">
                        {team.points}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <div>MP: Matches Played</div>
          <div>W: Wins</div>
          <div>D: Draws</div>
          <div>L: Losses</div>
          <div>GD: Goal Difference</div>
          <div>PTS: Points</div>
        </div>
      </div>
    </div>
  );
}

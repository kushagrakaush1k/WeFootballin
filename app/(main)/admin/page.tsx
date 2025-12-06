"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trophy,
  Edit2,
  Shield,
  TrendingUp,
  Search,
  Target,
  Zap,
  XCircle,
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

export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("payment_status", "approved")
        .order("points", { ascending: false })
        .order("goal_difference", { ascending: false })
        .order("goals_for", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Fetched teams:", data);
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      alert("Failed to load teams from database. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamStats = async (teamId: string, stats: Partial<Team>) => {
    setIsSaving(true);
    const goalDifference = (stats.goals_for ?? 0) - (stats.goals_against ?? 0);
    
    try {
      const { error } = await supabase
        .from("teams")
        .update({
          matches_played: stats.matches_played,
          wins: stats.wins,
          draws: stats.draws,
          losses: stats.losses,
          goals_for: stats.goals_for,
          goals_against: stats.goals_against,
          points: stats.points,
          goal_difference: goalDifference,
        })
        .eq("id", teamId);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      // Refresh teams from database
      await fetchTeams();
      
      setShowEditModal(false);
      setSelectedTeam(null);
      alert("✅ Team stats updated! Changes are live on leaderboard.");
    } catch (error) {
      console.error("Error updating team:", error);
      alert("❌ Failed to update team stats. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.team_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup =
      selectedGroup === "all" || team.league_group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getGroupStats = () => {
    const groupTeams =
      selectedGroup === "all"
        ? teams
        : teams.filter((t) => t.league_group === selectedGroup);

    return {
      totalTeams: groupTeams.length,
      totalMatches: groupTeams.reduce((acc, t) => acc + t.matches_played, 0),
      totalGoals: groupTeams.reduce((acc, t) => acc + t.goals_for, 0),
    };
  };

  const groupStats = getGroupStats();

  const stats = {
    totalTeams: teams.length,
    totalMatches: teams.reduce((acc, t) => acc + t.matches_played, 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading teams from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 pt-24 pb-16">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={fetchTeams}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          <p className="text-gray-600">
            Update team statistics - Changes sync to leaderboard instantly 🔥
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            {
              label: "Total Teams",
              value: stats.totalTeams,
              icon: Users,
              bg: "bg-emerald-100",
              text: "text-emerald-600",
            },
            {
              label: "Total Matches",
              value: stats.totalMatches,
              icon: Trophy,
              bg: "bg-purple-100",
              text: "text-purple-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
            />
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            <option value="all">All Groups</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
            <option value="C">Group C</option>
            <option value="D">Group D</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-200 flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {groupStats.totalTeams}
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Teams</div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {groupStats.totalMatches}
              </div>
            </div>
            <div className="text-sm text-gray-600">Matches Played</div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-200 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {groupStats.totalGoals}
              </div>
            </div>
            <div className="text-sm text-gray-600">Total Goals</div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50 border-b-2 border-emerald-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 uppercase">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-emerald-700 uppercase">Team</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">MP</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">W</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">D</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">L</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">GD</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-emerald-700 uppercase">PTS</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-emerald-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTeams.map((team, index) => {
                    const goalDifference = team.goals_for - team.goals_against;
                    const isTopTeam = index === 0;

                    return (
                      <tr
                        key={team.id}
                        className={`hover:bg-emerald-50/50 transition-colors ${
                          isTopTeam ? "bg-yellow-50/50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isTopTeam && <Trophy className="w-5 h-5 text-yellow-600" />}
                            <span className="font-bold text-gray-900">{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-bold text-gray-900">{team.team_name}</div>
                            <div className="text-xs text-gray-500">Group {team.league_group}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-700 font-medium">{team.matches_played}</td>
                        <td className="px-6 py-4 text-center text-green-600 font-bold">{team.wins}</td>
                        <td className="px-6 py-4 text-center text-yellow-600 font-bold">{team.draws}</td>
                        <td className="px-6 py-4 text-center text-red-600 font-bold">{team.losses}</td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`font-bold ${
                              goalDifference > 0
                                ? "text-green-600"
                                : goalDifference < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {goalDifference > 0 ? "+" : ""}{goalDifference}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold border-2 border-emerald-300">
                            {team.points}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedTeam(team);
                                setShowEditModal(true);
                              }}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                              title="Edit Team"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600 group-hover:text-blue-700" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredTeams.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No teams found</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mt-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <span><strong className="text-gray-900">MP:</strong> Matches Played</span>
              <span><strong className="text-gray-900">W:</strong> Wins</span>
              <span><strong className="text-gray-900">D:</strong> Draws</span>
              <span><strong className="text-gray-900">L:</strong> Losses</span>
              <span><strong className="text-gray-900">GD:</strong> Goal Difference</span>
              <span><strong className="text-gray-900">PTS:</strong> Points</span>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showEditModal && selectedTeam && (
          <EditTeamModal
            team={selectedTeam}
            onClose={() => {
              setShowEditModal(false);
              setSelectedTeam(null);
            }}
            onSave={(stats) => updateTeamStats(selectedTeam.id, stats)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface EditTeamModalProps {
  team: Team;
  onClose: () => void;
  onSave: (stats: Partial<Team>) => void;
  isSaving: boolean;
}

function EditTeamModal({ team, onClose, onSave, isSaving }: EditTeamModalProps) {
  const [matchesPlayed, setMatchesPlayed] = useState(team.matches_played);
  const [wins, setWins] = useState(team.wins);
  const [draws, setDraws] = useState(team.draws);
  const [losses, setLosses] = useState(team.losses);
  const [goalsFor, setGoalsFor] = useState(team.goals_for);
  const [goalsAgainst, setGoalsAgainst] = useState(team.goals_against);
  const [points, setPoints] = useState(team.points);

  const handleSave = () => {
    onSave({
      matches_played: matchesPlayed,
      wins,
      draws,
      losses,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      points,
    });
  };

  const inputClass = "w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Stats - {team.team_name}</h2>
          <button onClick={onClose} className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
            <XCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Matches Played</label>
            <input type="number" className={inputClass} value={matchesPlayed} onChange={(e) => setMatchesPlayed(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Wins</label>
            <input type="number" className={inputClass} value={wins} onChange={(e) => setWins(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Draws</label>
            <input type="number" className={inputClass} value={draws} onChange={(e) => setDraws(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Losses</label>
            <input type="number" className={inputClass} value={losses} onChange={(e) => setLosses(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Goals For</label>
            <input type="number" className={inputClass} value={goalsFor} onChange={(e) => setGoalsFor(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Goals Against</label>
            <input type="number" className={inputClass} value={goalsAgainst} onChange={(e) => setGoalsAgainst(Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Points</label>
            <input type="number" className={inputClass} value={points} onChange={(e) => setPoints(Number(e.target.value))} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
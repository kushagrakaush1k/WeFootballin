// COMPLETE FIX - Replace your entire admin/page.tsx with this

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Trophy,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  Shield,
  TrendingUp,
  UserCheck,
  Clock,
  Search,
  Target,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Team {
  id: string;
  team_name: string;
  league_group: string;
  payment_status: string;
  payment_screenshot_url: string | null;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  points: number;
  created_at: string;
}

interface Player {
  id: string;
  team_id: string;
  player_name: string;
  phone: string;
  instagram: string | null;
  is_captain: boolean;
}

type Tab = "overview" | "teams" | "pending" | "players";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [teams, setTeams] = useState<Team[]>([]);
  const [pendingTeams, setPendingTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    fetchData();
  }, []);

  const checkAdminAccess = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signin");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userData = data as { role: string } | null;

    if (!userData || userData.role !== "admin") {
      router.push("/");
      return;
    }

    // FIX: Add explicit type annotation here
    const { data: userData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single<{ role: string }>();

    if (userData?.role !== "admin") {
      router.push("/");
      return;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: teamsData } = await supabase
        .from("teams")
        .select("*")
        .eq("payment_status", "approved")
        .order("points", { ascending: false });

      const { data: pendingData } = await supabase
        .from("teams")
        .select("*")
        .eq("payment_status", "pending")
        .order("created_at", { ascending: false });

      const { data: playersData } = await supabase
        .from("team_players")
        .select("*")
        .order("team_id");

      setTeams(teamsData || []);
      setPendingTeams(pendingData || []);
      setPlayers(playersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveTeam = async (teamId: string) => {
    try {
      const { error } = await supabase
        .from("teams")
        .update({ payment_status: "approved" })
        .eq("id", teamId);

      if (error) throw error;

      await fetchData();
      alert("Team approved successfully!");
    } catch (error) {
      console.error("Error approving team:", error);
      alert("Failed to approve team");
    }
  };

  const rejectTeam = async (teamId: string) => {
    if (!confirm("Are you sure you want to reject this team?")) return;

    try {
      const { error } = await supabase
        .from("teams")
        .update({ payment_status: "rejected" })
        .eq("id", teamId);

      if (error) throw error;

      await fetchData();
      alert("Team rejected");
    } catch (error) {
      console.error("Error rejecting team:", error);
      alert("Failed to reject team");
    }
  };

  const deleteTeam = async (teamId: string, teamName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${teamName}"? This will permanently delete the team and all its players. This action cannot be undone.`
      )
    )
      return;

    setIsDeleting(true);

    try {
      const { error: playersError } = await supabase
        .from("team_players")
        .delete()
        .eq("team_id", teamId);

      if (playersError) {
        console.error("Error deleting players:", playersError);
        throw new Error(
          `Failed to delete team players: ${playersError.message}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const { error: teamError } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (teamError) {
        console.error("Error deleting team:", teamError);
        throw new Error(`Failed to delete team: ${teamError.message}`);
      }

      await fetchData();
      alert(`Team "${teamName}" deleted successfully!`);
    } catch (error: any) {
      console.error("Delete operation failed:", error);
      alert(
        `Failed to delete team: ${error.message}\n\nPlease check:\n1. Database RLS policies allow admin deletions\n2. No foreign key constraints are blocking deletion\n3. You have proper admin permissions`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const updateTeamStats = async (teamId: string, stats: Partial<Team>) => {
    try {
      const goalDifference = stats.goals_for! - stats.goals_against!;

      const { error } = await supabase
        .from("teams")
        .update({
          ...stats,
          goal_difference: goalDifference,
        })
        .eq("id", teamId);

      if (error) throw error;

      await fetchData();
      setShowEditModal(false);
      setSelectedTeam(null);
      alert("Team stats updated successfully!");
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Failed to update team stats");
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
    pendingApprovals: pendingTeams.length,
    totalPlayers: players.length,
    totalMatches: teams.reduce((acc, t) => acc + t.matches_played, 0),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-400">
            Manage teams, players, and league operations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Teams",
              value: stats.totalTeams,
              icon: Users,
              color: "emerald",
            },
            {
              label: "Pending Approvals",
              value: stats.pendingApprovals,
              icon: Clock,
              color: "yellow",
            },
            {
              label: "Total Players",
              value: stats.totalPlayers,
              icon: UserCheck,
              color: "blue",
            },
            {
              label: "Total Matches",
              value: stats.totalMatches,
              icon: Trophy,
              color: "purple",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: Trophy },
            { id: "teams", label: "All Teams", icon: Users },
            {
              id: "pending",
              label: "Pending",
              icon: Clock,
              badge: stats.pendingApprovals,
            },
            { id: "players", label: "Players", icon: UserCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {(activeTab === "teams" || activeTab === "players") && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:outline-none"
              />
            </div>

            {activeTab === "teams" && (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-purple-500/50 focus:outline-none"
              >
                <option value="all">All Groups</option>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
              </select>
            )}
          </div>
        )}

        {activeTab === "teams" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {groupStats.totalTeams}
                </div>
              </div>
              <div className="text-sm text-gray-400">Total Teams</div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {groupStats.totalMatches}
                </div>
              </div>
              <div className="text-sm text-gray-400">Matches Played</div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {groupStats.totalGoals}
                </div>
              </div>
              <div className="text-sm text-gray-400">Total Goals</div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 text-center">
                <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to Admin Panel
                </h2>
                <p className="text-gray-400">
                  Manage all aspects of the ROCK8 League from here
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "teams" && (
            <motion.div
              key="teams"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-emerald-900/30 border-b border-emerald-500/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-emerald-300 uppercase">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-emerald-300 uppercase">
                          Team
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          MP
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          W
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          D
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          L
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          GD
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-bold text-emerald-300 uppercase">
                          PTS
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-bold text-emerald-300 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTeams.map((team, index) => {
                        const goalDifference =
                          team.goals_for - team.goals_against;
                        const isTopTeam = index === 0;

                        return (
                          <tr
                            key={team.id}
                            className={`hover:bg-white/5 transition-colors ${
                              isTopTeam ? "bg-yellow-500/5" : ""
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {isTopTeam && (
                                  <Trophy className="w-5 h-5 text-yellow-500" />
                                )}
                                <span className="font-bold text-white">
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-bold text-white">
                                  {team.team_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Group {team.league_group}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-gray-300 font-medium">
                              {team.matches_played}
                            </td>
                            <td className="px-6 py-4 text-center text-green-400 font-bold">
                              {team.wins}
                            </td>
                            <td className="px-6 py-4 text-center text-yellow-400 font-bold">
                              {team.draws}
                            </td>
                            <td className="px-6 py-4 text-center text-red-400 font-bold">
                              {team.losses}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`font-bold ${
                                  goalDifference > 0
                                    ? "text-green-400"
                                    : goalDifference < 0
                                    ? "text-red-400"
                                    : "text-gray-400"
                                }`}
                              >
                                {goalDifference > 0 ? "+" : ""}
                                {goalDifference}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
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
                                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group"
                                  title="Edit Team"
                                  disabled={isDeleting}
                                >
                                  <Edit2 className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                                </button>
                                <button
                                  onClick={() =>
                                    deleteTeam(team.id, team.team_name)
                                  }
                                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete Team"
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
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
                      <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No teams found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mt-4">
                <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                  <span>
                    <strong className="text-white">MP:</strong> Matches Played
                  </span>
                  <span>
                    <strong className="text-white">W:</strong> Wins
                  </span>
                  <span>
                    <strong className="text-white">D:</strong> Draws
                  </span>
                  <span>
                    <strong className="text-white">L:</strong> Losses
                  </span>
                  <span>
                    <strong className="text-white">GD:</strong> Goal Difference
                  </span>
                  <span>
                    <strong className="text-white">PTS:</strong> Points
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {pendingTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {team.team_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Group {team.league_group} • Registered{" "}
                        {new Date(team.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-bold">
                      Pending
                    </span>
                  </div>

                  {team.payment_screenshot_url && (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setSelectedImage(team.payment_screenshot_url);
                          setShowImageModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Payment Screenshot</span>
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => approveTeam(team.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectTeam(team.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id, team.team_name)}
                      className="px-4 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 font-semibold rounded-xl transition-colors disabled:opacity-50"
                      disabled={isDeleting}
                      title="Delete Team"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {pendingTeams.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                  <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No pending approvals</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "players" && (
            <motion.div
              key="players"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="grid gap-4">
                  {players.map((player) => {
                    const team = teams.find((t) => t.id === player.team_id);
                    return (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 bg-black/40 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {player.player_name}
                              </span>
                              {player.is_captain && (
                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">
                                  CAPTAIN
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400">
                              {player.phone}
                              {team && (
                                <span className="ml-2 text-emerald-400">
                                  • {team.team_name}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        {player.instagram && (
                          <a
                            href={`https://instagram.com/${player.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-400 hover:text-pink-300 text-sm"
                          >
                            @{player.instagram}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showEditModal && selectedTeam && (
        <EditTeamModal
          team={selectedTeam}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTeam(null);
          }}
          onSave={updateTeamStats}
        />
      )}

      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-lg font-semibold"
            >
              Close ✕
            </button>
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold mb-2">Deleting Team...</p>
            <p className="text-gray-400 text-sm">Please wait</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EditTeamModal({
  team,
  onClose,
  onSave,
}: {
  team: Team;
  onClose: () => void;
  onSave: (id: string, stats: Partial<Team>) => void;
}) {
  const [stats, setStats] = useState({
    matches_played: team.matches_played,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    goals_for: team.goals_for,
    goals_against: team.goals_against,
    points: team.points,
    league_group: team.league_group,
  });

  const goalDifference = stats.goals_for - stats.goals_against;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Edit Team Stats - {team.team_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              League Group
            </label>
            <select
              value={stats.league_group}
              onChange={(e) =>
                setStats({ ...stats, league_group: e.target.value })
              }
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="A">Group A</option>
              <option value="B">Group B</option>
              <option value="C">Group C</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Matches Played (MP)
            </label>
            <input
              type="number"
              min="0"
              value={stats.matches_played}
              onChange={(e) =>
                setStats({
                  ...stats,
                  matches_played: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Points (PTS)
            </label>
            <input
              type="number"
              min="0"
              value={stats.points}
              onChange={(e) =>
                setStats({ ...stats, points: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-300 mb-2">
              Wins (W)
            </label>
            <input
              type="number"
              min="0"
              value={stats.wins}
              onChange={(e) =>
                setStats({ ...stats, wins: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-black/40 border border-green-500/30 rounded-lg text-white focus:border-green-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-300 mb-2">
              Draws (D)
            </label>
            <input
              type="number"
              min="0"
              value={stats.draws}
              onChange={(e) =>
                setStats({ ...stats, draws: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              Losses (L)
            </label>
            <input
              type="number"
              min="0"
              value={stats.losses}
              onChange={(e) =>
                setStats({ ...stats, losses: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-black/40 border border-red-500/30 rounded-lg text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Goals For (GF)
            </label>
            <input
              type="number"
              min="0"
              value={stats.goals_for}
              onChange={(e) =>
                setStats({ ...stats, goals_for: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Goals Against (GA)
            </label>
            <input
              type="number"
              min="0"
              value={stats.goals_against}
              onChange={(e) =>
                setStats({
                  ...stats,
                  goals_against: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  Goal Difference (GD)
                </span>
                <span
                  className={`text-2xl font-bold ${
                    goalDifference > 0
                      ? "text-green-400"
                      : goalDifference < 0
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {goalDifference > 0 ? "+" : ""}
                  {goalDifference}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(team.id, stats)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

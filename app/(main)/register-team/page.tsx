"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Shield,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Player {
  name: string;
  phone: string;
  instagram: string;
}

export default function RegisterTeamPage() {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState("");
  const [leagueGroup, setLeagueGroup] = useState<"A" | "B" | "C">("A");
  const [players, setPlayers] = useState<Player[]>([
    { name: "", phone: "", instagram: "" },
  ]);
  const [captainIndex, setCaptainIndex] = useState(0);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const addPlayer = () => {
    if (players.length < 15) {
      setPlayers([...players, { name: "", phone: "", instagram: "" }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = players.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      if (captainIndex === index) setCaptainIndex(0);
      if (captainIndex > index) setCaptainIndex(captainIndex - 1);
    }
  };

  const updatePlayer = (index: number, field: keyof Player, value: string) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setPaymentScreenshot(file);
      setError(null);
    }
  };

  const uploadPaymentScreenshot = async (file: File, teamId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${teamId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("team-payments")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("team-payments").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("Please login to register a team");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert({
          user_id: userId,
          team_name: teamName.trim(),
          league_group: leagueGroup,
          payment_status: "pending",
        })
        .select()
        .single();

      if (teamError) throw teamError;

      if (paymentScreenshot) {
        const paymentUrl = await uploadPaymentScreenshot(
          paymentScreenshot,
          teamData.id
        );
        await supabase
          .from("teams")
          .update({ payment_screenshot_url: paymentUrl })
          .eq("id", teamData.id);
      }

      const playersData = players.map((player, index) => ({
        team_id: teamData.id,
        player_name: player.name.trim(),
        phone: player.phone.trim(),
        instagram: player.instagram.trim() || null,
        is_captain: index === captainIndex,
      }));

      const { error: playersError } = await supabase
        .from("team_players")
        .insert(playersData);

      if (playersError) throw playersError;

      setStep(4);
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Failed to register team");
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return teamName.trim().length >= 3;
    if (step === 2)
      return (
        players.every((p) => p.name.trim() && p.phone.trim()) &&
        players.length >= 8 &&
        players.length <= 15
      );
    if (step === 3) return paymentScreenshot !== null;
    return false;
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-300 rounded-full mb-6 shadow-sm">
            <Trophy className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">
              ROCK8 LEAGUE REGISTRATION
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Register Your Team
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            Join the most competitive football league
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {step <= 3 && (
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Step {step} of 3
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl border-2 border-emerald-200 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Team Details
                    </h2>
                    <p className="text-gray-600">
                      Choose your team name and group
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 text-lg placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 focus:outline-none transition-all"
                    placeholder="e.g., Thunder Strikers"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500">Minimum 3 characters</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select League Group *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["A", "B", "C"] as const).map((group) => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => setLeagueGroup(group)}
                        className={`px-6 py-4 rounded-xl font-bold text-lg transition-all ${
                          leagueGroup === group
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-300/50"
                            : "bg-white border-2 border-emerald-200 text-gray-700 hover:border-emerald-400 shadow-sm"
                        }`}
                      >
                        Group {group}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Squad Details
                      </h2>
                      <p className="text-gray-600">
                        {players.length} players (min 8, max 15)
                      </p>
                    </div>
                  </div>

                  {players.length < 15 && (
                    <button
                      onClick={addPlayer}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-300 text-emerald-700 rounded-lg font-semibold shadow-sm hover:bg-emerald-200 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {players.map((player, index) => (
                    <div
                      key={index}
                      className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                            {index + 1}
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="captain"
                              checked={captainIndex === index}
                              onChange={() => setCaptainIndex(index)}
                              className="w-4 h-4 accent-emerald-600"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              Captain
                            </span>
                          </label>
                        </div>

                        {players.length > 1 && (
                          <button
                            onClick={() => removePlayer(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer(index, "name", e.target.value)
                          }
                          placeholder="Player Name *"
                          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                        <input
                          type="tel"
                          value={player.phone}
                          onChange={(e) =>
                            updatePlayer(index, "phone", e.target.value)
                          }
                          placeholder="Phone Number *"
                          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                        <input
                          type="text"
                          value={player.instagram}
                          onChange={(e) =>
                            updatePlayer(index, "instagram", e.target.value)
                          }
                          placeholder="Instagram (optional)"
                          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Proof
                    </h2>
                    <p className="text-gray-600">
                      Upload your payment screenshot
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Payment Details
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong className="text-emerald-700">Amount:</strong>{" "}
                      ₹5,000
                    </p>
                    <p>
                      <strong className="text-emerald-700">UPI ID:</strong>{" "}
                      wefootballin@paytm
                    </p>
                  </div>
                </div>

                <label className="block">
                  <div className="border-2 border-dashed border-emerald-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                    {paymentScreenshot ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3 text-emerald-600">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-semibold">
                            {paymentScreenshot.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {(paymentScreenshot.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-900 font-semibold mb-1">
                          Upload Payment Screenshot
                        </p>
                        <p className="text-sm text-gray-600">
                          Click to browse files (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-4">
                  Registration Submitted!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your team registration is under review. You'll receive
                  confirmation once approved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/leaderboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 transition-all"
                  >
                    View Leaderboard
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-emerald-200 text-gray-900 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-sm"
                  >
                    Back to Home
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step <= 3 && (
            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-200">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              <button
                onClick={() =>
                  step === 3 ? handleSubmit() : setStep(step + 1)
                }
                disabled={!canProceed() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-300/50 hover:shadow-emerald-400/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    {step === 3 ? "Submit Registration" : "Continue"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

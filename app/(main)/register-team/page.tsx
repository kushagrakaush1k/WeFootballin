"use client";

import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Zap,
  Star,
  PartyPopper,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Player {
  name: string;
  phone: string;
  instagram: string;
}

// SPONSORS DATA - Update links as needed
const sponsors = [
  { name: "LUPLU", logo: "/images/luplu-logo.png", link: "#" },
  { name: "XTCY", logo: "/images/XTCY-logo.png", link: "#" },
  { name: "LOOKS SALON", logo: "/images/Looks-salon-logo.png", link: "#" },
  { name: "IKIGAI", logo: "/images/ikigai-logo.png", link: "#" },
  { name: "DELHI HEIGHTS", logo: "/images/delhi-heights-logo.png", link: "#" },
  { name: "ROYAL GREEN", logo: "/images/royal-green-logo.png", link: "#" },
];

function SponsorsSlideshow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1.2;
    let scrollPosition = 0;

    const firstChild = scrollContainer.firstElementChild as HTMLElement;
    if (!firstChild) return;

    const itemWidth = firstChild.offsetWidth;
    const gap = 48;
    const singleSetWidth = (itemWidth + gap) * sponsors.length;

    const scroll = () => {
      if (!isPaused.current && scrollContainer) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-white to-emerald-50 py-8 mb-12 border-y-2 border-emerald-200">
      <p className="text-center text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4">
        Proudly Sponsored By
      </p>
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
          maskImage:
            "linear-gradient(90deg, transparent 0px, #000 40px, #000 calc(100% - 40px), transparent 100%)",
        }}
      >
        <div
          ref={scrollRef}
          className="flex gap-12 overflow-x-hidden whitespace-nowrap"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map(
            (sponsor, index) => (
              <div
                key={`${sponsor.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{ minWidth: "120px" }}
              >
                <div
                  className="bg-gray-900 rounded-xl p-3 flex items-center justify-center hover:scale-105 transition-transform"
                  style={{
                    width: 120,
                    height: 70,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={90}
                    height={55}
                    style={{ objectFit: "contain" }}
                    className="brightness-110"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterTeamPage() {
  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState("");
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-24 pb-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sponsors Slideshow */}
        <SponsorsSlideshow />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Join The Elite
            </span>
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Register Your Squad
            </span>
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            Ready to dominate? Let's get you signed up! ⚽
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 shadow-lg"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600 font-semibold text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        {step <= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="flex justify-between mb-3 px-2">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                Step {step} of 3
              </span>
              <span className="text-sm font-bold text-emerald-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-xl border-2 border-emerald-300 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-green-200/20 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {/* STEP 1: Team Name */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg"
                    >
                      <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">
                        What's Your Team Name?
                      </h2>
                      <p className="text-gray-600 font-medium">
                        Make it legendary! 🔥
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-8 py-6 bg-gradient-to-r from-emerald-50 to-green-50 border-3 border-emerald-300 rounded-2xl text-gray-900 text-xl font-bold placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 focus:outline-none transition-all shadow-lg"
                      placeholder="e.g., Thunder Strikers FC ⚡"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500 font-semibold flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      Minimum 3 characters - make it memorable!
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Trophy className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          League Groups
                        </h3>
                        <p className="text-sm text-gray-700">
                          Your team will be assigned to a group by our admin
                          team based on skill level and availability. Get ready
                          to compete!
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Squad Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg"
                      >
                        <Users className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">
                          Build Your Squad
                        </h2>
                        <p className="text-gray-600 font-semibold">
                          {players.length} players added (8-15 required)
                        </p>
                      </div>
                    </div>

                    {players.length < 15 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addPlayer}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        <UserPlus className="w-5 h-5" />
                        Add Player
                      </motion.button>
                    )}
                  </div>

                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                    {players.map((player, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                              {index + 1}
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="radio"
                                name="captain"
                                checked={captainIndex === index}
                                onChange={() => setCaptainIndex(index)}
                                className="w-5 h-5 accent-emerald-600"
                              />
                              <span className="text-sm text-gray-700 font-bold group-hover:text-emerald-600 transition-colors">
                                {captainIndex === index
                                  ? "👑 Captain"
                                  : "Make Captain"}
                              </span>
                            </label>
                          </div>

                          {players.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removePlayer(index)}
                              className="text-red-600 hover:text-red-700 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
                            >
                              Remove
                            </motion.button>
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
                            className="px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                          />
                          <input
                            type="tel"
                            value={player.phone}
                            onChange={(e) =>
                              updatePlayer(index, "phone", e.target.value)
                            }
                            placeholder="Phone Number *"
                            className="px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                          />
                          <input
                            type="text"
                            value={player.instagram}
                            onChange={(e) =>
                              updatePlayer(index, "instagram", e.target.value)
                            }
                            placeholder="@instagram (optional)"
                            className="px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-gray-900 font-semibold placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg"
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900">
                        Secure Your Spot
                      </h2>
                      <p className="text-gray-600 font-semibold">
                        Pay 20% advance to confirm registration 💳
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-100 border-3 border-emerald-400 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-7 h-7 text-emerald-600" />
                      <h3 className="text-2xl font-black text-gray-900">
                        Payment Details
                      </h3>
                    </div>
                    <div className="space-y-3 text-gray-800">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <span className="font-bold">Total Fee:</span>
                        <span className="text-2xl font-black text-emerald-600">
                          ₹50,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <span className="font-bold">Pay Now (20%):</span>
                        <span className="text-2xl font-black text-green-600">
                          ₹10,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border-2 border-emerald-300">
                        <span className="font-bold text-emerald-700">
                          UPI ID:
                        </span>
                        <span className="text-lg font-black text-emerald-700">
                          yespay.smessi33319@yesbankltd
                        </span>
                      </div>
                    </div>
                  </div>

                  <label className="block cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="border-3 border-dashed border-emerald-400 rounded-2xl p-12 text-center hover:border-emerald-600 hover:bg-emerald-50/50 transition-all shadow-lg"
                    >
                      {paymentScreenshot ? (
                        <div className="space-y-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"
                          >
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                          </motion.div>
                          <div className="flex flex-col items-center gap-2 text-emerald-700">
                            <span className="font-black text-lg">
                              {paymentScreenshot.name}
                            </span>
                            <span className="text-sm font-semibold">
                              {(paymentScreenshot.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-semibold">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                          <p className="text-gray-900 font-black text-xl mb-2">
                            Upload Payment Screenshot
                          </p>
                          <p className="text-sm text-gray-600 font-semibold">
                            Click to browse (Max 5MB)
                          </p>
                        </>
                      )}
                    </motion.div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </motion.div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-8 shadow-2xl"
                  >
                    <PartyPopper className="w-16 h-16 text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                  >
                    🎉 Registration Complete! 🎉
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-700 font-semibold mb-3"
                  >
                    Welcome to the elite,{" "}
                    <span className="text-emerald-600 font-black">
                      {teamName}
                    </span>
                    !
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-emerald-100 to-green-100 border-2 border-emerald-300 rounded-2xl p-8 mb-10 max-w-2xl mx-auto"
                  >
                    <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center justify-center gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                      What Happens Next?
                    </h3>
                    <div className="space-y-3 text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-xs">
                            1
                          </span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          Our admin team will verify your payment within 24-48
                          hours
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-xs">
                            2
                          </span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          You'll receive a confirmation email with match
                          schedule & group details
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-xs">
                            3
                          </span>
                        </div>
                        <p className="text-gray-700 font-semibold">
                          Get ready to dominate the pitch! Training starts soon
                          🔥
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600 font-semibold mb-10"
                  >
                    Keep an eye on your inbox and phone for updates!
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <a
                      href="/leaderboard"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      View Leaderboard
                      <Trophy className="w-5 h-5" />
                    </a>
                    <a
                      href="/"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-3 border-emerald-300 text-gray-900 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg"
                    >
                      Back to Home
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step <= 3 && (
              <div className="flex gap-4 mt-10 pt-8 border-t-2 border-emerald-200">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(step - 1)}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-emerald-300 text-gray-900 font-bold rounded-xl hover:bg-emerald-50 transition-all disabled:opacity-50 shadow-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    step === 3 ? handleSubmit() : setStep(step + 1)
                  }
                  disabled={!canProceed() || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      {step === 3 ? (
                        <>
                          <CheckCircle2 className="w-6 h-6" />
                          Submit Registration
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="w-6 h-6" />
                        </>
                      )}
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Fun Footer Message */}
        {step <= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-gray-600 font-semibold"
          >
            Need help? Contact us at{" "}
            <a
              href="mailto:support@wefootballin.com"
              className="text-emerald-600 hover:text-emerald-700 font-bold"
            >
              wefootballin@gmail.com
            </a>
          </motion.p>
        )}
      </div>
    </div>
  );
}

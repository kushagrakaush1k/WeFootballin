"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

type SignUpStep = "details" | "verify";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<SignUpStep>("details");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setError("This email is already registered. Please sign in instead.");
          setLoading(false);
          return;
        }

        setStep("verify");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: "signup",
      });

      if (verifyError) throw verifyError;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            role: "user",
          },
        ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: formData.email,
      });

      if (resendError) throw resendError;

      alert("Verification code resent to your email!");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 flex items-center justify-center px-4 py-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-emerald-300/10 via-green-300/5 to-transparent blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="relative bg-white/90 backdrop-blur-2xl border-2 border-emerald-200 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent rounded-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8 relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl mb-4 shadow-lg shadow-emerald-300/50"
                  >
                    <Sparkles
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                    />
                  </motion.div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                    Join WeFootballin'
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Create your account to register for ROCK8 League 25'!
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border-2 border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="Mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="relative w-full group mt-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-300/40 border border-emerald-400/50">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <Mail className="w-10 h-10 text-emerald-600" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-gray-600 text-sm mb-1">
                    We sent a verification code to
                  </p>
                  <p className="text-emerald-600 font-semibold">
                    {formData.email}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm mb-4"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2 text-center">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
                      }
                      className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 text-center text-2xl tracking-widest placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                      placeholder="00000000"
                      maxLength={8}
                      required
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Enter the 8-digit code from your email
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || otp.length !== 8}
                    className="relative w-full group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-300/40 border border-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Email</span>
                          <CheckCircle2 className="w-5 h-5" />
                        </>
                      )}
                    </div>
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                    >
                      Didn't receive the code?{" "}
                      <span className="font-semibold">Resend</span>
                    </button>
                  </div>

                  <div className="text-center pt-4 border-t-2 border-gray-200">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      ← Back to sign up
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-500 text-xs mt-6"
        >
          By signing up, you agree to become part of the elite WeFootballin'
          platform
        </motion.p>
      </motion.div>
    </div>
  );
}

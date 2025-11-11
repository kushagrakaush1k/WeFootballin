"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { signUpUser, signInUser } from "@/lib/auth.client";

interface SignInFormState {
  email: string;
  password: string;
}

interface SignUpFormState {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function AuthPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [signInData, setSignInData] = useState<SignInFormState>({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState<SignUpFormState>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!signInData.email || !signInData.password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (!signInData.email.includes("@")) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      const { user, error: signInError } = await signInUser({
        email: signInData.email,
        password: signInData.password,
      });

      if (signInError) {
        setError(signInError);
        setIsLoading(false);
        return;
      }

      if (user) {
        setSuccess("Sign in successful! Redirecting...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");

        window.location.href = redirect || "/";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSignUp = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validation
      if (
        !signUpData.fullName ||
        !signUpData.email ||
        !signUpData.phone ||
        !signUpData.password ||
        !signUpData.confirmPassword
      ) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (!signUpData.email.includes("@")) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (signUpData.fullName.length < 3) {
        setError("Full name must be at least 3 characters");
        setIsLoading(false);
        return;
      }

      if (signUpData.phone.length < 10) {
        setError("Please enter a valid phone number (10+ digits)");
        setIsLoading(false);
        return;
      }

      if (signUpData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      if (signUpData.password !== signUpData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Strong password check
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signUpData.password)) {
        setError("Password must contain uppercase, lowercase, and numbers");
        setIsLoading(false);
        return;
      }

      const { user, error: signUpError } = await signUpUser({
        email: signUpData.email,
        password: signUpData.password,
        fullName: signUpData.fullName,
        phone: signUpData.phone,
      });

      if (signUpError) {
        setError(signUpError);
        setIsLoading(false);
        return;
      }

      if (user) {
        setSuccess("Account created successfully! Signing you in...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        window.location.href = "/register-team";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      if (isSignUp) {
        handleSignUp();
      } else {
        handleSignIn();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl pointer-events-none" />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* Mobile View */}
      <div className="lg:hidden w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 p-6 sm:p-8 overflow-hidden"
        >
          {/* Header Logo */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 relative drop-shadow-lg">
                <Image
                  src="/images/wefootballin-logo.png"
                  alt="WeFootballin Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </motion.div>
          )}

          {/* Header Text */}
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
              {isSignUp ? "Join Us" : "Welcome Back"}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {isSignUp
                ? "Create your WeFootballin' account"
                : "Sign in to continue"}
            </p>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-green-50 border border-green-300 rounded-xl flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-600 text-sm font-semibold">{success}</p>
            </motion.div>
          )}

          {/* Form Container */}
          {!isSignUp ? (
            <motion.div
              key="signin-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Sign In Fields */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    value={signInData.email}
                    onChange={(e) =>
                      setSignInData({ ...signInData, email: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signInData.password}
                    onChange={(e) =>
                      setSignInData({
                        ...signInData,
                        password: e.target.value,
                      })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-14 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="signup-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
            >
              {/* Sign Up Fields */}
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="text"
                    value={signUpData.fullName}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        fullName: e.target.value,
                      })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, email: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="your@email.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, phone: e.target.value })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="9876543210"
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        password: e.target.value,
                      })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Min 6 chars, 1 uppercase, 1 number"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={signUpData.confirmPassword}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        confirmPassword: e.target.value,
                      })
                    }
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-14 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Repeat password"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignUp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Toggle Auth Mode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center pt-6 border-t border-gray-200"
          >
            <p className="text-gray-600 text-sm">
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setSuccess("");
                  setSignInData({ email: "", password: "" });
                  setSignUpData({
                    fullName: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block relative w-full max-w-7xl h-screen lg:h-[750px] z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/30 overflow-hidden"
        >
          {/* Sign In Form - Left Side */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center px-16 py-12"
            initial={false}
            animate={{
              x: isSignUp ? "-100%" : "0%",
              opacity: isSignUp ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="w-full max-w-md space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
                  Welcome Back
                </h1>
                <p className="text-lg text-gray-600">
                  Sign in to your account and continue
                </p>
              </motion.div>

              {error && !isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </motion.div>
              )}

              {success && !isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-300 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-600 text-sm font-semibold">
                    {success}
                  </p>
                </motion.div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-14 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Form - Right Side */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center px-16 py-12"
            initial={false}
            animate={{
              x: isSignUp ? "0%" : "100%",
              opacity: isSignUp ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div className="w-full max-w-md space-y-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
                  Join Us
                </h1>
                <p className="text-lg text-gray-600">
                  Create your WeFootballin' account
                </p>
              </motion.div>

              {error && isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </motion.div>
              )}

              {success && isSignUp && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-300 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-green-600 text-sm font-semibold">
                    {success}
                  </p>
                </motion.div>
              )}

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="text"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your full name"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="you@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type="tel"
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, phone: e.target.value })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="9876543210"
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Min 6 chars, 1 uppercase, 1 number"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          confirmPassword: e.target.value,
                        })
                      }
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-14 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Repeat password"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Sliding Animated Panel */}
          <motion.div
            className="absolute top-0 w-1/2 h-full bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 shadow-2xl flex flex-col items-center justify-center p-12 z-20 overflow-hidden"
            initial={false}
            animate={{
              x: isSignUp ? "0%" : "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <motion.div
              className="relative z-10 text-center space-y-8 max-w-md"
              key={isSignUp ? "signup-panel" : "signin-panel"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="w-48 h-48 mx-auto relative drop-shadow-2xl"
              >
                <Image
                  src="/images/wefootballin-logo.png"
                  alt="WeFootballin Logo"
                  width={192}
                  height={192}
                  className="w-full h-full object-contain filter drop-shadow-xl"
                  priority
                />
              </motion.div>

              {/* Text */}
              {!isSignUp ? (
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white mb-4">
                    New Here?
                  </h2>
                  <p className="text-xl text-emerald-100 leading-relaxed">
                    Join WeFootballin' today and start playing football with our
                    amazing community!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                      setSuccess("");
                    }}
                    className="px-10 py-4 bg-white text-emerald-600 font-black rounded-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    disabled={isLoading}
                  >
                    Sign Up Now
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white mb-4">
                    Welcome Back!
                  </h2>
                  <p className="text-xl text-emerald-100 leading-relaxed">
                    Sign in to your account and continue your football journey.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="px-10 py-4 bg-white text-emerald-600 font-black rounded-xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    disabled={isLoading}
                  >
                    Sign In
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import { signUpUser, signInUser, verifyOTPAndLogin } from "@/lib/auth.client";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", "", "", ""]);

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

  const handleOtpChange = (index: number, value: string): void => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 8);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(8).fill("")).slice(0, 8);
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 7);
    const lastInput = document.getElementById(
      `otp-${lastIndex}`
    ) as HTMLInputElement;
    lastInput?.focus();
  };

  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      if (!signInData.email || !signInData.password) {
        setError("Please fill in all fields");
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
        // Check for redirect parameter
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect");

        // Wait for session to be fully established
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Redirect to intended page or admin
        window.location.href = redirect || "/admin";
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

    try {
      if (signUpData.password !== signUpData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (signUpData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      if (!signUpData.email || !signUpData.fullName || !signUpData.phone) {
        setError("Please fill in all fields");
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
        setStep("verify");
      }
      setIsLoading(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (): Promise<void> => {
    const otpCode = otp.join("");

    if (otpCode.length !== 8) {
      setError("Please enter all 8 digits");
      return;
    }

    if (!/^\d+$/.test(otpCode)) {
      setError("OTP must contain only numbers");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { user, error: verifyError } = await verifyOTPAndLogin(
        signUpData.email,
        otpCode
      );

      if (verifyError) {
        setError(verifyError);
        setIsLoading(false);
        return;
      }

      if (user) {
        // Wait for session to be fully established
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Redirect to admin after signup
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
      console.error(err);
      setIsLoading(false);
    }
  };
  if (step === "verify") {
    const isOtpComplete = otp.join("").length === 8;

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-200/50 p-6 sm:p-10 max-w-lg w-full"
        >
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
              Verify Your Email
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              We've sent an 8-digit verification code to
            </p>
            <p className="text-emerald-600 font-bold text-base sm:text-lg break-all px-4">
              {signUpData.email}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4 text-center">
                Enter 8-Digit Verification Code
              </label>
              <div
                className="flex gap-1 sm:gap-2 justify-center"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit: string, index: number) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-9 h-11 sm:w-12 sm:h-14 bg-white border-2 border-gray-300 rounded-xl text-gray-900 text-center text-xl sm:text-2xl font-bold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                    disabled={isLoading}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Check your email inbox for the 8-digit code
              </p>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={!isOtpComplete || isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verify Code</span>
                </>
              )}
            </button>

            <div className="text-center space-y-3">
              <button
                className="text-sm text-gray-600 hover:text-emerald-600 font-semibold transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Didn't receive the code?{" "}
                <span className="underline">Resend</span>
              </button>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setStep("form");
                    setSignUpData({
                      fullName: "",
                      email: "",
                      phone: "",
                      password: "",
                      confirmPassword: "",
                    });
                    setOtp(["", "", "", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium disabled:opacity-50"
                  disabled={isLoading}
                >
                  ← Back to sign up
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-3 sm:p-4">
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
      `}</style>

      {/* Mobile View */}
      <div className="lg:hidden w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-emerald-200/50 p-6 sm:p-8">
          {!isSignUp ? (
            <div className="w-full space-y-6">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-6">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Sign in to continue your journey
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                      disabled={isLoading}
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
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-14 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
                    className="text-emerald-600 font-bold hover:underline disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <div className="text-center mb-8">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 relative">
                  <Image
                    src="/images/wefootballin-logo.png"
                    alt="WeFootballin Logo"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Join Us
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Create your WeFootballin' account
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                      disabled={isLoading}
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
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                      disabled={isLoading}
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
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, phone: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your phone number"
                      disabled={isLoading}
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
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Min 6 characters"
                      disabled={isLoading}
                    />
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
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
                    className="text-emerald-600 font-bold hover:underline disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block relative w-full max-w-6xl h-screen lg:h-[700px]">
        <div className="relative w-full h-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden">
          {/* Sign In Form */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 flex items-center justify-center px-12 py-8"
            initial={false}
            animate={{
              x: isSignUp ? "-100%" : "0%",
              opacity: isSignUp ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
            }}
          >
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg">
                  Sign in to continue your journey
                </p>
              </div>

              {error && !isSignUp && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signInData.email}
                      onChange={(e) =>
                        setSignInData({ ...signInData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                      disabled={isLoading}
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
                      value={signInData.password}
                      onChange={(e) =>
                        setSignInData({
                          ...signInData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-14 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
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
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Form */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 flex items-center justify-center px-12 py-8"
            initial={false}
            animate={{
              x: isSignUp ? "0%" : "100%",
              opacity: isSignUp ? 1 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
            }}
          >
            <div className="w-full max-w-md space-y-6">
              <div className="text-center">
                <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
                  Join Us
                </h1>
                <p className="text-gray-600 text-lg">
                  Create your WeFootballin' account
                </p>
              </div>

              {error && isSignUp && (
                <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                      disabled={isLoading}
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
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                      disabled={isLoading}
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
                      value={signUpData.phone}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, phone: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your phone number"
                      disabled={isLoading}
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
                      value={signUpData.password}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Min 6 characters"
                      disabled={isLoading}
                    />
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
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sliding Panel */}
          <motion.div
            className="absolute top-0 w-1/2 h-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-2xl flex flex-col items-center justify-center p-8 z-10 overflow-hidden"
            initial={false}
            animate={{
              x: isSignUp ? "0%" : "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
            }}
          >
            <motion.div
              className="mb-8 flex-shrink-0"
              animate={{
                scale: isSignUp ? 1 : 0.9,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <Image
                  src="/images/wefootballin-logo.png"
                  alt="WeFootballin Logo"
                  width={192}
                  height={192}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              className="text-center text-white space-y-6 max-w-md"
              initial={false}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
              }}
              key={isSignUp ? "signup-panel" : "signin-panel"}
            >
              {!isSignUp ? (
                <>
                  <h2 className="text-4xl font-black mb-4">New Here?</h2>
                  <p className="text-lg text-emerald-50 mb-8">
                    Join WeFootballin' today and start your journey with us!
                  </p>
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError("");
                    }}
                    className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Sign Up Now
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black mb-4">Welcome Back!</h2>
                  <p className="text-lg text-emerald-50 mb-8">
                    Sign in to access your account and continue where you left
                    off.
                  </p>
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError("");
                    }}
                    className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

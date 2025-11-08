"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Menu,
  X,
  Trophy,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const supabase = createClient();

  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    getUser();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const getUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await fetchUserProfile(authUser.id);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profile) {
      setUser(profile);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/signup";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/register-team", label: "ROCK8", icon: Zap, highlight: true },
  ];

  return (
    <>
      <motion.nav
        style={{ opacity: navOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 m-0 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-3xl border-b border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
            : "bg-black/80 backdrop-blur-2xl border-b border-white/5"
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group relative z-10"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:shadow-emerald-500/70 transition-all duration-300 border border-emerald-400/30 overflow-hidden">
                  <Image
                    src="/images/logofootballin.jpg"
                    alt="WeFootballin Logo"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full rounded-2xl"
                    priority
                  />
                  <motion.div
                    className="absolute -top-1 -right-1 z-10"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles
                      className="w-3 h-3 text-yellow-300 drop-shadow-lg"
                      fill="currentColor"
                    />
                  </motion.div>
                </div>
              </motion.div>

              <div className="flex flex-col">
                <motion.span
                  className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  style={{ textShadow: "0 0 40px rgba(16, 185, 129, 0.3)" }}
                >
                  WeFootballin'
                </motion.span>
                <span className="text-[10px] font-bold text-emerald-400/70 tracking-widest uppercase -mt-1 drop-shadow">
                  Elite Platform
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setActiveLink(link.href)}
                      className="relative group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                          link.highlight
                            ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/40 border border-emerald-400/50"
                            : activeLink === link.href
                            ? "bg-white/10 text-white backdrop-blur-sm border border-white/20"
                            : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 relative z-10">
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{link.label}</span>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              <div className="relative w-px h-10 mx-2">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />
              </div>

              {user ? (
                <div className="flex items-center gap-3">
                  {/* Admin Button */}
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-xl blur-lg opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                        <div className="relative flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/50 text-purple-200 rounded-xl font-bold backdrop-blur-sm hover:border-purple-400/80 transition-all duration-300 shadow-lg shadow-purple-500/20">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin</span>
                        </div>
                      </motion.div>
                    </Link>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:border-emerald-500/60 transition-all duration-300 group shadow-lg shadow-black/20"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/40 border border-emerald-300/30">
                          <UserIcon
                            className="w-4 h-4 text-white drop-shadow"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-white max-w-[120px] truncate drop-shadow">
                        {user.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-all duration-300 ${
                          showUserMenu ? "rotate-180 text-emerald-400" : ""
                        }`}
                      />
                    </motion.button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-3 w-64 bg-black/97 backdrop-blur-2xl border border-emerald-500/20 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg">
                                  <UserIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <p className="font-bold text-white text-sm">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-2">
                              <motion.button
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200 font-semibold"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                              </motion.button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-white font-bold hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-xl"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-3 text-white hover:bg-white/10 rounded-xl transition-all z-10"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-black/98 backdrop-blur-3xl border-l border-emerald-500/20 z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-emerald-500/20">
                  <span className="text-lg font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    WeFootballin'
                  </span>
                  <button onClick={() => setIsOpen(false)} className="p-2">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl font-bold ${
                        link.highlight
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                          : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {link.icon && <link.icon className="w-5 h-5" />}
                      {link.label}
                    </Link>
                  ))}
                </div>

                {user ? (
                  <>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 bg-purple-500/20 text-purple-300 rounded-xl font-bold"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="pt-6 border-t border-emerald-500/20">
                      <div className="flex items-center gap-3 px-4 py-4 bg-white/5 rounded-xl mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-500/20 text-red-400 rounded-xl font-bold"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-6 border-t border-emerald-500/20 space-y-3">
                    <Link
                      href="/signin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-4 text-center text-white font-bold bg-white/5 rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-4 text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  );
}

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
  Home,
  Menu,
  X,
  Trophy,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  BookOpen,
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
    { href: "/", label: "Home", icon: Home },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/register-team", label: "ROCK8", icon: Zap, highlight: true },
  ];

  return (
    <>
      <motion.nav
        style={{ opacity: navOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-emerald-200/60 shadow-sm"
            : "bg-white/80 backdrop-blur-lg border-b border-gray-200/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/wefootballin-logo.png"
                  alt="WeFootballin"
                  width={90}
                  height={90}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setActiveLink(link.href)}
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                        link.highlight
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/25"
                          : activeLink === link.href
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{link.label}</span>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}

              <div className="w-px h-8 bg-gray-200 mx-2" />

              {user ? (
                <div className="flex items-center gap-2">
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <motion.div
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg font-semibold text-sm hover:bg-purple-100 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin</span>
                      </motion.div>
                    </Link>
                  )}

                  <div className="relative">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                        <User
                          className="w-4 h-4 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 max-w-[100px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white border border-emerald-200 rounded-xl shadow-xl overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-emerald-100 bg-emerald-50/50">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                                  <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-2">
                              <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 text-gray-700 font-semibold text-sm hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold text-sm rounded-lg shadow-md shadow-emerald-500/25 transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors"
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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-emerald-200 z-50 md:hidden overflow-y-auto shadow-xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-emerald-200">
                  <Image
                    src="/images/wefootballin-logo.png"
                    alt="WeFootballin"
                    width={140}
                    height={50}
                    className="object-contain"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                        link.highlight
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-emerald-50"
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
                        className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-semibold border border-purple-200"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}

                    <div className="pt-6 border-t border-emerald-200">
                      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-6 border-t border-emerald-200 space-y-3">
                    <Link
                      href="/signin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center text-gray-700 font-semibold bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-md"
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

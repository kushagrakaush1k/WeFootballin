"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  BookOpen,
  Zap,
  Instagram,
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
  const [activeLink, setActiveLink] = useState("/");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLeaguesMenu, setShowLeaguesMenu] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const supabase = createClient();
  const pathname = usePathname();

  // Dynamic color for nav links depending on route
  const isDarkNavbar = pathname === "/"; // change this if you have multiple dark-background pages

  useEffect(() => {
    // Try session restore on mount for persistent login
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    window.location.href = "/signin";
  };

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/pickup", label: "PICKUP" },
    { href: "/blog", label: "BLOG" },
  ];
  const leagueLinks = [{ href: "/register-team", label: "ROCK8", icon: Zap }];

  // Helper for color: white on dark pages, emerald/dark on light
  const navLinkColor = (linkHref: string) =>
    activeLink === linkHref
      ? "text-emerald-400"
      : isDarkNavbar
      ? "text-white hover:text-emerald-400"
      : "text-gray-900 hover:text-emerald-600";

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : -120 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 ${
          isDarkNavbar ? "bg-transparent" : "bg-white shadow"
        }`}
      >
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-28">
            {/* Logo - Left Side */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/images/wefootballin-logo.png"
                  alt="WeFootballin"
                  width={100}
                  height={100}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-20 flex-1 justify-center pl-20">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                >
                  <div
                    className={`text-xl font-black tracking-tight transition-colors duration-200 cursor-pointer ${navLinkColor(
                      link.href
                    )}`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}

              {/* Leagues Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLeaguesMenu(!showLeaguesMenu)}
                  className={`flex items-center gap-2 text-xl font-black transition-colors duration-200 tracking-tight cursor-pointer ${
                    isDarkNavbar
                      ? "text-white hover:text-emerald-400"
                      : "text-gray-900 hover:text-emerald-600"
                  }`}
                >
                  LEAGUES
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showLeaguesMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {showLeaguesMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 mt-6 w-56 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden"
                      onClick={() => setShowLeaguesMenu(false)}
                    >
                      {leagueLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block"
                        >
                          <div className="flex items-center gap-3 px-6 py-4 text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 font-semibold text-base">
                            {link.icon && <link.icon className="w-6 h-6" />}
                            {link.label}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Section - Auth & User */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Instagram Button */}
              <motion.a
                href="https://instagram.com/we_footballin"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 ${
                  isDarkNavbar
                    ? "text-white hover:text-emerald-400"
                    : "text-emerald-600 hover:text-emerald-800"
                } transition-colors duration-200 cursor-pointer`}
              >
                <Instagram className="w-6 h-6" />
              </motion.a>

              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/50 border border-purple-400 text-white rounded-lg font-bold text-sm hover:bg-purple-600/70 transition-colors duration-200 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>ADMIN</span>
                      </div>
                    </Link>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600/50 border border-emerald-400 rounded-lg hover:bg-emerald-600/70 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                        <User
                          className="w-4 h-4 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white transition-transform duration-200 ${
                          showUserMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

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
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-3 w-60 bg-white border border-emerald-300 rounded-xl shadow-xl overflow-hidden z-50"
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
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium text-sm"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>SIGN OUT</span>
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <Link href="/signin">
                  <button
                    className={`px-6 py-2.5 font-bold text-sm transition-colors duration-200 cursor-pointer ${
                      isDarkNavbar
                        ? "text-white hover:text-emerald-400"
                        : "text-emerald-600 hover:text-emerald-800"
                    }`}
                  >
                    SIGN IN
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 ${
                isDarkNavbar ? "text-white" : "text-emerald-600"
              }`}
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
              className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-emerald-200 z-50 lg:hidden overflow-y-auto shadow-xl"
            >
              <div className="p-6 space-y-8">
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

                <div className="space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setIsOpen(false);
                        setActiveLink(link.href);
                      }}
                      className={`block px-4 py-3 rounded-lg font-bold text-sm transition-colors duration-200 ${
                        activeLink === link.href
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-700 hover:bg-emerald-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Mobile Leagues */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowLeaguesMenu(!showLeaguesMenu)}
                      className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-bold text-sm transition-colors duration-200"
                    >
                      <span>LEAGUES</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          showLeaguesMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showLeaguesMenu && (
                      <div className="pl-4 space-y-2">
                        {leagueLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 rounded-lg font-semibold text-sm transition-colors duration-200"
                          >
                            {link.icon && <link.icon className="w-5 h-5" />}
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile Instagram */}
                <div className="flex justify-center pt-4 border-t border-emerald-200">
                  <motion.a
                    href="https://instagram.com/wefootballin"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 text-gray-900 hover:text-emerald-600 transition-colors duration-200"
                  >
                    <Instagram className="w-6 h-6" />
                  </motion.a>
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
                        ADMIN PANEL
                      </Link>
                    )}

                    <div className="pt-8 border-t border-emerald-200 space-y-3">
                      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-lg">
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        SIGN OUT
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-8 border-t border-emerald-200">
                    <Link
                      href="/signin"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center text-white font-bold bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                    >
                      SIGN IN
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

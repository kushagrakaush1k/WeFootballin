"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  Heart,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { label: "Home", href: "/" },
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Register Team", href: "/register-team" },
    ],
    support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
    social: [
      { icon: Instagram, href: "#", label: "Instagram" },
      { icon: Twitter, href: "#", label: "Twitter" },
      { icon: Facebook, href: "#", label: "Facebook" },
    ],
  };

  return (
    <footer className="relative bg-gradient-to-b from-white via-emerald-50/30 to-emerald-50/50 border-t-2 border-emerald-100 pt-20 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0fdf4_1px,transparent_1px),linear-gradient(to_bottom,#f0fdf4_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white"
              >
                <Trophy className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                WeFootballin'
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your ultimate football community platform. Connect, compete, and
              conquer together.
            </p>
            <div className="flex gap-3">
              {links.social.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-2 border-emerald-200/50 hover:border-emerald-300 flex items-center justify-center transition-all group shadow-sm hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-black text-lg mb-5 relative inline-block">
              Platform
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {links.platform.map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-black text-lg mb-5 relative inline-block">
              Support
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
            </h3>
            <ul className="space-y-3">
              {links.support.map((link, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-emerald-600 transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-black text-lg mb-5 relative inline-block">
              Stay Updated
              <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Get the latest updates about matches and tournaments
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none transition-colors shadow-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl transition-all shadow-lg shadow-emerald-500/30 border-2 border-white"
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="py-10 border-t-2 border-b-2 border-emerald-100">
          <div className="text-center mb-8">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-300" />
              Powered By Our Amazing Partners
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-300" />
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="relative text-gray-900 font-black text-3xl px-6 py-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 group-hover:border-emerald-300 transition-all shadow-sm">
                  LupLu
                </div>
              </motion.div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-emerald-300 to-transparent" />

              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="relative text-gray-800 font-bold text-2xl px-6 py-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 group-hover:border-emerald-300 transition-all shadow-sm">
                  IKIGAI
                </div>
              </motion.div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-emerald-300 to-transparent" />

              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="relative text-gray-700 font-semibold text-xl px-6 py-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 group-hover:border-emerald-300 transition-all shadow-sm">
                  Delhi Heights
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-600 text-sm font-medium flex items-center gap-2">
              © {currentYear} WeFootballin'. Made with
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              in India
            </p>
            <div className="flex items-center gap-8 text-sm">
              <Link
                href="/terms"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                Cookies
              </Link>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center">
            <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          </div>
        </div>
      </div>
    </footer>
  );
}
